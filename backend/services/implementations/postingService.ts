import {
  PrismaClient,
  Posting,
  Skill,
  Employee,
  Branch,
  Shift,
} from "@prisma/client";
import IPostingService from "../interfaces/IPostingService";
import {
  PostingRequestDTO,
  PostingResponseDTO,
  PostingType,
  ShiftDTO,
} from "../../types";
import logger from "../../utilities/logger";

const prisma = new PrismaClient();

const Logger = logger(__filename);

// Temporary type for posting with inlcuded relations (i.e. branch, shifts, skills, employees)
type PostingWithRelations = {
  id: number;
  branchId: number;
  title: string;
  type: PostingType;
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

// Given a PostingWithRelations, return the array of skill names
function getPostingSkillNames(posting: PostingWithRelations): string[] {
  const postingSkillNames: string[] = posting.skills.map(
    (skill: Skill) => skill.name,
  );
  if (!postingSkillNames) {
    throw new Error(`posting skills ${posting.skills} not found.`);
  }
  return postingSkillNames;
}

// Given a PostingWithRelations, return the array of employee ids
function getPostingEmployeeIds(posting: PostingWithRelations): string[] {
  const postingEmployeeIds: string[] = posting.employees.map(
    (employee: Employee) => String(employee.id),
  );
  if (!postingEmployeeIds) {
    throw new Error(`posting employees ${posting.skills} not found.`);
  }
  return postingEmployeeIds;
}

// Given a PostingWithRelations, return the array of shifts as ShiftDTO
// (i.e. convert id and postingId to strings)
function convertShiftToShiftDTO(posting: PostingWithRelations): ShiftDTO[] {
  return posting.shifts.map((shift: Shift) => {
    return {
      id: String(shift.id),
      postingId: String(shift.postingId),
      startTime: shift.startTime,
      endTime: shift.endTime,
    };
  });
}

function validateDate(date: string) {
  const d = new Date(date); // date: YYYY-MM-DD
  d.toISOString(); // d.toISOString() should error if d is invalid date
  return true;
}

function validatePostingDates(posting: PostingRequestDTO) {
  return (
    validateDate(posting.startDate) &&
    validateDate(posting.endDate) &&
    validateDate(posting.autoClosingDate)
  );
}

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
      branchName: posting.branch.name,
      shifts: convertShiftToShiftDTO(posting),
      skillNames: getPostingSkillNames(posting),
      employees: getPostingEmployeeIds(posting),
      title: posting.title,
      type: posting.type,
      description: posting.description,
      startDate: posting.startDate.toISOString().substring(0, 10),
      endDate: posting.endDate.toISOString().substring(0, 10),
      autoClosingDate: posting.autoClosingDate.toISOString().substring(0, 10),
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
          return {
            id: String(posting.id),
            branchName: posting.branch.name,
            shifts: convertShiftToShiftDTO(posting),
            skillNames: getPostingSkillNames(posting),
            employees: getPostingEmployeeIds(posting),
            title: posting.title,
            type: posting.type,
            description: posting.description,
            startDate: posting.startDate.toISOString().substring(0, 10),
            endDate: posting.endDate.toISOString().substring(0, 10),
            autoClosingDate: posting.autoClosingDate
              .toISOString()
              .substring(0, 10),
            numVolunteers: posting.numVolunteers,
          };
        }),
      );
    } catch (error) {
      Logger.error(`Failed to get postings. Reason = ${error.message}`);
      throw error;
    }
  }

  async createPosting(posting: PostingRequestDTO): Promise<PostingResponseDTO> {
    let newPosting: PostingWithRelations; // Posting | null;
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
      branchName: newPosting.branch.name,
      shifts: convertShiftToShiftDTO(newPosting),
      skillNames: getPostingSkillNames(newPosting),
      employees: posting.employees,
      title: posting.title,
      type: posting.type,
      description: posting.description,
      startDate: posting.startDate,
      endDate: posting.endDate,
      autoClosingDate: posting.autoClosingDate,
      numVolunteers: posting.numVolunteers,
    };
  }

  async updatePosting(
    postingId: string,
    posting: PostingRequestDTO,
  ): Promise<PostingResponseDTO | null> {
    let updateResult: PostingWithRelations; // Posting | null;

    try {
      validatePostingDates(posting);

      updateResult = await prisma.posting.update({
        where: { id: Number(postingId) },
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
      if (!updateResult) {
        throw new Error(`Posting id ${postingId} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to update posting. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: String(updateResult.id),
      branchName: updateResult.branch.name,
      shifts: convertShiftToShiftDTO(updateResult),
      skillNames: getPostingSkillNames(updateResult),
      employees: posting.employees,
      title: posting.title,
      type: posting.type,
      description: posting.description,
      startDate: posting.startDate,
      endDate: posting.endDate,
      autoClosingDate: posting.autoClosingDate,
      numVolunteers: posting.numVolunteers,
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
