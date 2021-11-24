import { PrismaClient, Posting, Branch, Skill } from "@prisma/client";
import IPostingService from "../interfaces/IPostingService";
import { PostingRequestDTO, PostingResponseDTO } from "../../types";
import logger from "../../utilities/logger";

const prisma = new PrismaClient();

const Logger = logger(__filename);

async function getPostingBranchName(posting: Posting) {
  const postingBranch: Branch | null = await prisma.branch.findUnique({
    where: {
      id: Number(posting.branchId),
    },
  });

  if (!postingBranch) {
    throw new Error(`postingBranch ${posting.branchId} not found.`);
  }
  return postingBranch.name;
}

//fix
async function getPostingSkillNames(posting: any) { 
  const postingSkillNames: string[] = posting.skills.map(
    (skill: Skill) => skill.name,
  );
  // const postingSkillNames:
  //   | string[]
  //   | null = await prisma.skill
  //   .findMany()
  //   .then((skills: Skill[]) =>
  //     skills
  //       .filter((skill: Skill) => posting.skills.includes(skill.id))
  //       .map((skill: Skill) => skill.name),
  //   );

  if (!postingSkillNames) {
    throw new Error(`posting skills ${posting.skills} not found.`);
  }
  return postingSkillNames;
}

function validateDate(date: string) {
  const d = new Date(date); // date: YYYY-MM-DD
  const e = d.toISOString(); // d.toISOString() should error if d is invalid date
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
    let posting: any; //Posting | null;
    let postingBranchName: string;
    let postingSkillNames: Array<string>;

    try {
      posting = await prisma.posting.findUnique({
        where: {
          id: Number(postingId),
        },
        include: {
          shifts: true,
          skills: true
        },
      });

      if (!posting) {
        throw new Error(`postingId ${postingId} not found.`);
      }

      postingBranchName = await getPostingBranchName(posting);
      postingSkillNames = await getPostingSkillNames(posting);
    } catch (error) {
      Logger.error(`Failed to get posting. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: String(posting.id),
      branchName: postingBranchName,
      shifts: posting.shifts,
      skillNames: postingSkillNames,
      employees: posting.employees,
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
      const postings: any /*Array<Posting>*/ = await prisma.posting.findMany({
        include: {
          shifts: true,
          skills: true
        },
      });
      return await Promise.all(
        postings.map(async (posting: any) => {
          const postingBranchName: string = await getPostingBranchName(posting);
          const postingSkillNames: Array<string> = await getPostingSkillNames(
            posting,
          );

          return {
            id: String(posting.id),
            branchName: postingBranchName,
            shifts: posting.shifts,
            skillNames: postingSkillNames,
            employees: posting.employees,
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
    let newPosting: any; //Posting | null;
    let postingBranchName: string;
    let postingSkillNames: Array<string>;
    try {
      validatePostingDates(posting);

      newPosting = await prisma.posting.create({
        data: {
          branchId: Number(posting.branchId),
          // skills: {
          //   connect: posting.skills.map((skillId: string) => {
          //     return { id: Number(skillId) };
          //   }),
          // },
          // employees: {
          //   connect: posting.employees.map((employeeId: string) => {
          //     return { id: Number(employeeId) };
          //   }),
          // },
          title: posting.title,
          type: posting.type,
          description: posting.description,
          startDate: new Date(posting.startDate),
          endDate: new Date(posting.endDate),
          autoClosingDate: new Date(posting.autoClosingDate),
          numVolunteers: posting.numVolunteers,
        },
        include: {
          employees: true,
          skills: true,
          shifts: true,
        },
      });

      postingBranchName = await getPostingBranchName(newPosting);
      postingSkillNames = await getPostingSkillNames(newPosting);
    } catch (error) {
      Logger.error(`Failed to create posting. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: String(newPosting.id),
      branchName: postingBranchName,
      shifts: newPosting.shifts,
      skillNames: postingSkillNames,
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
    let updateResult: any; //Posting | null;
    let postingBranchName: string;
    let postingSkillNames: Array<string>;

    try {
      validatePostingDates(posting);

      updateResult = await prisma.posting.update({
        where: { id: Number(postingId) },
        data: {
          branchId: Number(posting.branchId)!,
          // skills: {
          //   connect: posting.skills?.map((skillId: string) => {
          //     return { id: Number(skillId) };
          //   }),
          // },
          // employees: {
          //   connect: posting.employees?.map((employeeId: string) => {
          //     return { id: Number(employeeId) };
          //   }),
          // },
          title: posting.title,
          type: posting.type,
          description: posting.description,
          startDate: new Date(posting.startDate),
          endDate: new Date(posting.endDate),
          autoClosingDate: new Date(posting.autoClosingDate),
          numVolunteers: posting.numVolunteers,
        },
        include: {
          employees: true,
          skills: true,
        },
      });

      if (!updateResult) {
        throw new Error(`Posting id ${postingId} not found`);
      }

      postingBranchName = await getPostingBranchName(updateResult);
      postingSkillNames = await getPostingSkillNames(updateResult);
    } catch (error) {
      Logger.error(`Failed to update posting. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: String(updateResult.id),
      branchName: postingBranchName,
      shifts: updateResult.shifts,
      skillNames: postingSkillNames,
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

  async deletePosting(postingId: string): Promise<void> {
    try {
      const postingToDelete = await prisma.posting.findUnique({
        where: { id: Number(postingId) },
      });
      const deleteResult: Posting | null = await prisma.posting.delete({
        where: { id: Number(postingId) },
      });

      if (!postingToDelete || !deleteResult) {
        throw new Error(`Posting id ${postingId} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to delete posting. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default PostingService;
