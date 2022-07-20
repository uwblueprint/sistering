import {
  PrismaClient,
  Posting,
  Skill,
  Employee,
  Branch,
  Shift,
  PostingStatus as PrismaPostingStatus,
  Signup,
} from "@prisma/client";
import IPostingService from "../interfaces/postingService";
import IUserService from "../interfaces/userService";
import {
  BranchResponseDTO,
  EmployeeUserResponseDTO,
  PostingRequestDTO,
  PostingResponseDTO,
  PostingStatus,
  PostingType,
  PostingWithShiftsRequestDTO,
  ShiftResponseDTO,
  SkillResponseDTO,
} from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";
import IShiftService from "../interfaces/IShiftService";

const prisma = new PrismaClient();

const Logger = logger(__filename);

// Temporary type for posting with included relations (i.e. branch, shifts, skills, employees)
type PostingWithRelations = {
  id: number;
  branchId: number;
  title: string;
  type: PostingType;
  status: PostingStatus;
  description: string;
  startDate: Date;
  endDate: Date;
  autoClosingDate: Date;
  numVolunteers: number;
  branch: Branch;
  shifts: Shift[];
  skills: Skill[];
  employees: Employee[];
};

export type Enumerable<T> = T | Array<T>;

type IntFilter = {
  in?: Enumerable<number>;
};

type EnumPostingStatusFilter = {
  in?: Enumerable<PostingStatus>;
};

type DateTimeFilter = {
  gt?: Date;
};

type PostingWhereInput = {
  branchId?: IntFilter;
  status?: EnumPostingStatusFilter;
  autoClosingDate?: DateTimeFilter;
};

// HELPER FUNCTIONS

const convertToBranchResponseDTO = (branch: Branch): BranchResponseDTO => {
  return {
    id: String(branch.id),
    name: branch.name,
  };
};

const convertToShiftResponseDTO = (shifts: Shift[]): ShiftResponseDTO[] => {
  return shifts.map((shift: Shift) => {
    return {
      id: String(shift.id),
      postingId: String(shift.postingId),
      startTime: shift.startTime,
      endTime: shift.endTime,
    };
  });
};

const convertToSkillResponseDTO = (skills: Skill[]): SkillResponseDTO[] => {
  return skills.map((skill: Skill) => {
    return {
      id: String(skill.id),
      name: skill.name,
    };
  });
};

const isPostingScheduledBySignups = (signups: Signup[]): boolean => {
  return signups
    .flatMap((signup) => signup.status)
    .some((signupStatus) => signupStatus === "PUBLISHED");
};

class PostingService implements IPostingService {
  shiftService: IShiftService;

  userService: IUserService;
  /* eslint-disable class-methods-use-this */

  constructor(userService: IUserService, shiftService: IShiftService) {
    this.userService = userService;
    this.shiftService = shiftService;
  }

  async getUserBranchesByUserId(userId: string): Promise<number[]> {
    try {
      const volunteer = await this.userService.getVolunteerUserById(userId);
      return volunteer.branches.map((branch: BranchResponseDTO) => +branch.id);
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async convertToEmployeeUserResponseDTO(
    employees: Employee[],
  ): Promise<EmployeeUserResponseDTO[]> {
    return Promise.all(
      employees.map(async (employee) => {
        return this.userService.getEmployeeUserById(String(employee.id));
      }),
    );
  }

  async getPosting(postingId: string): Promise<PostingResponseDTO> {
    try {
      const posting = await prisma.posting.findUnique({
        where: {
          id: Number(postingId),
        },
        include: {
          branch: true,
          shifts: {
            include: {
              signups: true,
            },
          },
          skills: true,
          employees: true,
        },
      });

      if (!posting) {
        throw new Error(`postingId ${postingId} not found.`);
      }

      const employeeUsers = await this.convertToEmployeeUserResponseDTO(
        posting.employees,
      );

      return {
        id: String(posting.id),
        branch: convertToBranchResponseDTO(posting.branch),
        shifts: convertToShiftResponseDTO(posting.shifts),
        skills: convertToSkillResponseDTO(posting.skills),
        employees: employeeUsers,
        title: posting.title,
        type: posting.type,
        status: posting.status,
        description: posting.description,
        startDate: posting.startDate,
        endDate: posting.endDate,
        autoClosingDate: posting.autoClosingDate,
        numVolunteers: posting.numVolunteers,
        isScheduled: isPostingScheduledBySignups(
          posting.shifts.flatMap((shift) => shift.signups),
        ),
      };
    } catch (error: unknown) {
      Logger.error(`Failed to get posting. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getPostings(
    closingDate?: Date,
    statuses?: PostingStatus[],
    userId?: string,
  ): Promise<PostingResponseDTO[]> {
    return prisma.$transaction(async (prismaClient) => {
      const filter: PostingWhereInput[] = [];
      if (closingDate !== undefined) {
        filter.push({ autoClosingDate: { gt: closingDate } });
      }
      if (statuses !== undefined) {
        filter.push({ status: { in: statuses } });
      }
      if (userId !== undefined) {
        const userBranchIds = await this.getUserBranchesByUserId(userId);
        filter.push({ branchId: { in: userBranchIds } });
      }

      try {
        const postings = await prismaClient.posting.findMany({
          where: {
            AND: filter,
          },
          include: {
            branch: true,
            shifts: {
              include: {
                signups: true,
              },
            },
            skills: true,
            employees: true,
          },
        });
        return await Promise.all(
          postings.map(async (posting) => {
            const employeeUsers: EmployeeUserResponseDTO[] = await this.convertToEmployeeUserResponseDTO(
              posting.employees,
            );

            return {
              id: String(posting.id),
              branch: convertToBranchResponseDTO(posting.branch),
              shifts: convertToShiftResponseDTO(posting.shifts),
              skills: convertToSkillResponseDTO(posting.skills),
              employees: employeeUsers,
              title: posting.title,
              type: posting.type,
              status: posting.status,
              description: posting.description,
              startDate: posting.startDate,
              endDate: posting.endDate,
              autoClosingDate: posting.autoClosingDate,
              numVolunteers: posting.numVolunteers,
              isScheduled: isPostingScheduledBySignups(
                posting.shifts.flatMap((shift) => shift.signups),
              ),
            };
          }),
        );
      } catch (error: unknown) {
        Logger.error(
          `Failed to get postings. Reason = ${getErrorMessage(error)}`,
        );
        throw error;
      }
    });
  }

  async createPosting(
    posting: PostingWithShiftsRequestDTO,
  ): Promise<PostingResponseDTO> {
    let newPosting: PostingWithRelations;

    try {
      const timeBlocks = this.shiftService.bulkGenerateTimeBlocks({
        times: posting.times,
        recurrenceInterval: posting.recurrenceInterval,
        startDate: posting.startDate,
        endDate: posting.endDate,
      });

      newPosting = await prisma.posting.create({
        data: {
          branch: {
            connect: { id: Number(posting.branchId) },
          },
          skills: {
            connect: posting.skills.map((skillId: string) => {
              return { id: Number(skillId) };
            }),
          },
          employees: {
            connect: posting.employees.map((employeeId: string) => {
              return { id: Number(employeeId) };
            }),
          },
          shifts: {
            createMany: {
              data: timeBlocks,
            },
          },
          title: posting.title,
          type: posting.type,
          status: posting.status,
          description: posting.description,
          startDate: posting.startDate,
          endDate: posting.endDate,
          autoClosingDate: posting.autoClosingDate,
          numVolunteers: posting.numVolunteers,
        },
        include: {
          branch: true,
          shifts: true,
          skills: true,
          employees: true,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to create posting. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    const employeeUsers: EmployeeUserResponseDTO[] = await this.convertToEmployeeUserResponseDTO(
      newPosting.employees,
    );

    return {
      id: String(newPosting.id),
      branch: convertToBranchResponseDTO(newPosting.branch),
      shifts: convertToShiftResponseDTO(newPosting.shifts),
      skills: convertToSkillResponseDTO(newPosting.skills),
      employees: employeeUsers,
      title: newPosting.title,
      type: newPosting.type,
      status: newPosting.status,
      description: newPosting.description,
      startDate: newPosting.startDate,
      endDate: newPosting.endDate,
      autoClosingDate: newPosting.autoClosingDate,
      numVolunteers: newPosting.numVolunteers,
      isScheduled: false, // New posting is not scheduled
    };
  }

  async updatePosting(
    postingId: string,
    posting: PostingRequestDTO,
  ): Promise<PostingResponseDTO | null> {
    try {
      const updateResult = await prisma.posting.update({
        where: { id: Number(postingId) },
        data: {
          branch: {
            connect: { id: Number(posting.branchId) },
          },
          skills: {
            set: [],
            connect: posting.skills.map((skillId: string) => {
              return { id: Number(skillId) };
            }),
          },
          employees: {
            set: [],
            connect: posting.employees.map((employeeId: string) => {
              return { id: Number(employeeId) };
            }),
          },
          title: posting.title,
          type: posting.type,
          status: posting.status,
          description: posting.description,
          startDate: posting.startDate,
          endDate: posting.endDate,
          autoClosingDate: posting.autoClosingDate,
          numVolunteers: posting.numVolunteers,
        },
        include: {
          branch: true,
          shifts: {
            include: {
              signups: true,
            },
          },
          skills: true,
          employees: true,
        },
      });

      const employeeUsers: EmployeeUserResponseDTO[] = await this.convertToEmployeeUserResponseDTO(
        updateResult.employees,
      );

      return {
        id: String(updateResult.id),
        branch: convertToBranchResponseDTO(updateResult.branch),
        shifts: convertToShiftResponseDTO(updateResult.shifts),
        skills: convertToSkillResponseDTO(updateResult.skills),
        employees: employeeUsers,
        title: updateResult.title,
        type: updateResult.type,
        status: updateResult.status,
        description: updateResult.description,
        startDate: updateResult.startDate,
        endDate: updateResult.endDate,
        autoClosingDate: updateResult.autoClosingDate,
        numVolunteers: updateResult.numVolunteers,
        isScheduled: isPostingScheduledBySignups(
          updateResult.shifts.flatMap((shift) => shift.signups),
        ),
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to update posting. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deletePosting(postingId: string): Promise<string> {
    try {
      const deleteResult: Posting | null = await prisma.posting.delete({
        where: { id: Number(postingId) },
      });
      return String(deleteResult.id);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete posting. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async duplicatePosting(postingId: string): Promise<string> {
    try {
      // get posting along with its postings
      const targetPosting = await prisma.posting.findUnique({
        where: { id: Number(postingId) },
        include: {
          shifts: true,
          employees: true,
          skills: true,
        },
      });
      if (targetPosting === null) {
        throw new Error(`Target posting with ${postingId} not found`);
      }

      // create duplicate posting
      const duplicatePosting = await prisma.posting.create({
        data: {
          branch: {
            connect: { id: targetPosting.branchId },
          },
          skills: {
            connect: targetPosting.skills.map((skill) => {
              return { id: skill.id };
            }),
          },
          employees: {
            connect: targetPosting.employees.map((employee) => {
              return { id: employee.id };
            }),
          },
          shifts: {
            createMany: {
              data:
                targetPosting.shifts.map((shift) => {
                  return { startTime: shift.startTime, endTime: shift.endTime };
                }) ?? [],
            },
          },
          title: `Copy of ${targetPosting.title}`,
          type: targetPosting.type,
          status: PrismaPostingStatus.DRAFT,
          description: targetPosting.description,
          startDate: targetPosting.startDate,
          endDate: targetPosting.endDate,
          autoClosingDate: targetPosting.autoClosingDate,
          numVolunteers: targetPosting.numVolunteers,
        },
      });

      return String(duplicatePosting.id);
    } catch (error: unknown) {
      Logger.error(
        `Failed to duplicate posting. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default PostingService;
