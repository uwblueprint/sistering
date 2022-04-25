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
  EmployeeUserResponseDTO,
  PostingRequestDTO,
  PostingResponseDTO,
  PostingStatus,
  PostingType,
  ShiftResponseDTO,
  SkillResponseDTO,
} from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

import UserService from "./userService";

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

// HELPER FUNCTIONS

const userService: IUserService = new UserService();

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

const convertToEmployeeUserResponseDTO = async (
  employees: Employee[],
): Promise<EmployeeUserResponseDTO[]> => {
  return Promise.all(
    employees.map(async (employee) => {
      return userService.getEmployeeUserById(String(employee.id));
    }),
  );
};

class PostingService implements IPostingService {
  /* eslint-disable class-methods-use-this */

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

      // const employee = await prisma.
      if (!posting) {
        throw new Error(`postingId ${postingId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get posting. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    const employeesArr = await convertToEmployeeUserResponseDTO(
      posting.employees,
    );

    return {
      id: String(posting.id),
      branch: convertToBranchResponseDTO(posting.branch),
      shifts: convertToShiftResponseDTO(posting.shifts),
      skills: convertToSkillResponseDTO(posting.skills),
      employees: employeesArr,
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

  async getPostings(): Promise<PostingResponseDTO[]> {
    try {
      const postings: Array<PostingWithRelations> = await prisma.posting.findMany(
        {
          include: {
            branch: true,
            shifts: true,
            skills: true,
            employees: true,
          },
        },
      );

      return await Promise.all(
        postings.map(async (posting: PostingWithRelations) => {
          const employeesArr: EmployeeUserResponseDTO[] = await convertToEmployeeUserResponseDTO(
            posting.employees,
          );

          return {
            id: String(posting.id),
            branch: convertToBranchResponseDTO(posting.branch),
            shifts: convertToShiftResponseDTO(posting.shifts),
            skills: convertToSkillResponseDTO(posting.skills),
            employees: employeesArr,
            title: posting.title,
            type: posting.type,
            status: posting.status,
            description: posting.description,
            startDate: posting.startDate,
            endDate: posting.endDate,
            autoClosingDate: posting.autoClosingDate,
            numVolunteers: posting.numVolunteers,
          };
        }),
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to get postings. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createPosting(posting: PostingRequestDTO): Promise<PostingResponseDTO> {
    let newPosting: PostingWithRelations;

    try {
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

    const employeesArr: EmployeeUserResponseDTO[] = await convertToEmployeeUserResponseDTO(
      newPosting.employees,
    );

    return {
      id: String(newPosting.id),
      branch: convertToBranchResponseDTO(newPosting.branch),
      shifts: convertToShiftResponseDTO(newPosting.shifts),
      skills: convertToSkillResponseDTO(newPosting.skills),
      employees: employeesArr,
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

    const employeesArr: EmployeeUserResponseDTO[] = await convertToEmployeeUserResponseDTO(
      updateResult.employees,
    );

    return {
      id: String(updateResult.id),
      branch: convertToBranchResponseDTO(updateResult.branch),
      shifts: convertToShiftResponseDTO(updateResult.shifts),
      skills: convertToSkillResponseDTO(updateResult.skills),
      employees: employeesArr,
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
