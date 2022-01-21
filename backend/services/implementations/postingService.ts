import {
  PrismaClient,
  Posting,
  Skill,
  Employee,
  Branch,
  Shift,
} from "@prisma/client";
import IPostingService from "../interfaces/postingService";
import {
  BranchResponseDTO,
  EmployeeResponseDTO,
  PostingRequestDTO,
  PostingResponseDTO,
  PostingStatus,
  PostingType,
  ShiftResponseDTO,
  SkillResponseDTO,
} from "../../types";
import logger from "../../utilities/logger";

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
      userId: String(employee.userId),
      branchId: String(employee.branchId),
    };
  });
};

const formatDate = (date: Date): string => {
  return date.toISOString().substring(0, 10);
};

const validateDate = (date: string) => {
  const d = new Date(date); // date: YYYY-MM-DD
  d.toISOString(); // d.toISOString() should error if d is invalid date
  return true;
};

const validatePostingDates = (posting: PostingRequestDTO) => {
  return (
    validateDate(posting.startDate) &&
    validateDate(posting.endDate) &&
    validateDate(posting.autoClosingDate)
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

      if (!posting) {
        throw new Error(`postingId ${postingId} not found.`);
      }
    } catch (error) {
      Logger.error(`Failed to get posting. Reason = ${error.message}`);
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
      startDate: formatDate(posting.startDate),
      endDate: formatDate(posting.endDate),
      autoClosingDate: formatDate(posting.autoClosingDate),
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
          startDate: formatDate(posting.startDate),
          endDate: formatDate(posting.endDate),
          autoClosingDate: formatDate(posting.autoClosingDate),
          numVolunteers: posting.numVolunteers,
        };
      });
    } catch (error) {
      Logger.error(`Failed to get postings. Reason = ${error.message}`);
      throw error;
    }
  }

  async createPosting(posting: PostingRequestDTO): Promise<PostingResponseDTO> {
    let newPosting: PostingWithRelations;
    try {
      validatePostingDates(posting);

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
          startDate: new Date(posting.startDate),
          endDate: new Date(posting.endDate),
          autoClosingDate: new Date(posting.autoClosingDate),
          numVolunteers: posting.numVolunteers,
        },
        include: {
          branch: true,
          shifts: true,
          skills: true,
          employees: true,
        },
      });
    } catch (error) {
      Logger.error(`Failed to create posting. Reason = ${error.message}`);
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
      startDate: String(newPosting.startDate),
      endDate: String(newPosting.endDate),
      autoClosingDate: String(newPosting.autoClosingDate),
      numVolunteers: newPosting.numVolunteers,
    };
  }

  async updatePosting(
    postingId: string,
    posting: PostingRequestDTO,
  ): Promise<PostingResponseDTO | null> {
    let updateResult: PostingWithRelations;

    try {
      validatePostingDates(posting);

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
          startDate: new Date(posting.startDate),
          endDate: new Date(posting.endDate),
          autoClosingDate: new Date(posting.autoClosingDate),
          numVolunteers: posting.numVolunteers,
        },
        include: {
          branch: true,
          shifts: true,
          skills: true,
          employees: true,
        },
      });
    } catch (error) {
      Logger.error(`Failed to update posting. Reason = ${error.message}`);
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
      startDate: String(updateResult.startDate),
      endDate: String(updateResult.endDate),
      autoClosingDate: String(updateResult.autoClosingDate),
      numVolunteers: updateResult.numVolunteers,
    };
  }

  async deletePosting(postingId: string): Promise<string> {
    try {
      const deleteResult: Posting | null = await prisma.posting.delete({
        where: { id: Number(postingId) },
      });
      return String(deleteResult.id);
    } catch (error) {
      Logger.error(`Failed to delete posting. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default PostingService;
