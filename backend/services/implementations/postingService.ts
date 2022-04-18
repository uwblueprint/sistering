import {
  PrismaClient,
  Posting,
  Skill,
  Employee,
  Branch,
  Shift,
} from "@prisma/client";
import IPostingService from "../interfaces/postingService";
import IUserService from "../interfaces/userService";
import {
  BranchResponseDTO,
  EmployeeResponseDTO,
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

const convertToEmployeeResponseDTO = (
  employees: Employee[],
): EmployeeResponseDTO[] => {
  return employees.map((employee: Employee) => {
    return {
      id: String(employee.id),
      branchId: String(employee.branchId),
      title: employee.title,
    };
  });
};

class PostingService implements IPostingService {
  shiftService: IShiftService;
  /* eslint-disable class-methods-use-this */
  userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
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

  constructor(shiftService: IShiftService) {
    this.shiftService = shiftService;
  }

  async getPosting(postingId: string): Promise<PostingResponseDTO> {
    let posting: PostingWithRelations | null;

    try {
      posting = await prisma.posting.findUnique({
        where: {
          id: Number(postingId),
        },
        include: {
          branch: true,
          shifts: true,
          skills: true,
          employees: true,
        },
      });

      if (!posting) {
        throw new Error(`postingId ${postingId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get posting. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: String(posting.id),
      branch: convertToBranchResponseDTO(posting.branch),
      shifts: convertToShiftResponseDTO(posting.shifts),
      skills: convertToSkillResponseDTO(posting.skills),
      employees: convertToEmployeeResponseDTO(posting.employees),
      title: posting.title,
      type: posting.type,
      status: posting.status,
      description: posting.description,
      startDate: posting.startDate,
      endDate: posting.endDate,
      autoClosingDate: posting.autoClosingDate,
      numVolunteers: posting.numVolunteers,
    };
  }

  async getPostings(
    closingDate?: Date,
    statuses?: [PostingStatus],
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
        const postings: Array<PostingWithRelations> = await prismaClient.posting.findMany(
          {
            where: {
              AND: filter,
            },
            include: {
              branch: true,
              shifts: true,
              skills: true,
              employees: true,
            },
          },
        );
        return postings.map((posting: PostingWithRelations) => {
          return {
            id: String(posting.id),
            branch: convertToBranchResponseDTO(posting.branch),
            shifts: convertToShiftResponseDTO(posting.shifts),
            skills: convertToSkillResponseDTO(posting.skills),
            employees: convertToEmployeeResponseDTO(posting.employees),
            title: posting.title,
            type: posting.type,
            status: posting.status,
            description: posting.description,
            startDate: posting.startDate,
            endDate: posting.endDate,
            autoClosingDate: posting.autoClosingDate,
            numVolunteers: posting.numVolunteers,
          };
        });
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
    return {
      id: String(newPosting.id),
      branch: convertToBranchResponseDTO(newPosting.branch),
      shifts: convertToShiftResponseDTO(newPosting.shifts),
      skills: convertToSkillResponseDTO(newPosting.skills),
      employees: convertToEmployeeResponseDTO(newPosting.employees),
      title: newPosting.title,
      type: newPosting.type,
      status: newPosting.status,
      description: newPosting.description,
      startDate: newPosting.startDate,
      endDate: newPosting.endDate,
      autoClosingDate: newPosting.autoClosingDate,
      numVolunteers: newPosting.numVolunteers,
    };
  }

  async updatePosting(
    postingId: string,
    posting: PostingRequestDTO,
  ): Promise<PostingResponseDTO | null> {
    let updateResult: PostingWithRelations;

    try {
      updateResult = await prisma.posting.update({
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
          shifts: true,
          skills: true,
          employees: true,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to update posting. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(updateResult.id),
      branch: convertToBranchResponseDTO(updateResult.branch),
      shifts: convertToShiftResponseDTO(updateResult.shifts),
      skills: convertToSkillResponseDTO(updateResult.skills),
      employees: convertToEmployeeResponseDTO(updateResult.employees),
      title: updateResult.title,
      type: updateResult.type,
      status: updateResult.status,
      description: updateResult.description,
      startDate: updateResult.startDate,
      endDate: updateResult.endDate,
      autoClosingDate: updateResult.autoClosingDate,
      numVolunteers: updateResult.numVolunteers,
    };
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
}

export default PostingService;
