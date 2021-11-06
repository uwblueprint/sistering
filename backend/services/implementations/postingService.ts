import { PrismaClient, Posting } from "@prisma/client";
import IPostingService from "../interfaces/IPostingService";
import { PostingRequestDTO, PostingResponseDTO } from "../../types";
import logger from "../../utilities/logger";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class PostingService implements IPostingService {
  /* eslint-disable class-methods-use-this */

  async getPosting(postingId: string): Promise<PostingResponseDTO> {
    let posting: Posting | null;

    try {
      posting = await prisma.posting.findUnique({
        where: {
          id: Number(postingId),
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
      // TODO: need BranchDTO
      // branch: Branch;
      // shifts: Shift[];
      // skills: PostingOnSkill[];
      employee: posting.employee,
      title: posting.title,
      type: posting.type,
      description: posting.description,
      startDate: posting.startDate,
      endDate: posting.endDate,
      autoClosingDate: posting.autoClosingDate,
      numVolunteers: posting.numVolunteers,
    };
  }

  async getPostings(): Promise<PostingResponseDTO[]> {
    try {
      const postings: Array<Posting> = await prisma.posting.findMany();
      return postings.map((posting) => ({
        id: String(posting.id),
        // TODO: need BranchDTO
        // branch: Branch;
        // shifts: Shift[];
        // skills: PostingOnSkill[];
        employee: posting.employee,
        title: posting.title,
        type: posting.type,
        description: posting.description,
        startDate: posting.startDate,
        endDate: posting.endDate,
        autoClosingDate: posting.autoClosingDate,
        numVolunteers: posting.numVolunteers,
        requiresAdminVerification: posting.requiresAdminVerification,
      }));
    } catch (error) {
      Logger.error(`Failed to get postings. Reason = ${error.message}`);
      throw error;
    }
  }

  async createPosting(posting: PostingRequestDTO): Promise<PostingResponseDTO> {
    let newPosting: Posting | null;
    try {
      newPosting = await prisma.posting.create({
        data: {
          // TODO: need BranchDTO
          // branch: Branch;
          // shifts: Shift[];
          // skills: PostingOnSkill[];
          employee: posting.employee,
          title: posting.title,
          type: posting.type,
          description: posting.description,
          startDate: posting.startDate,
          endDate: posting.endDate,
          autoClosingDate: posting.autoClosingDate,
          numVolunteers: posting.numVolunteers,
        },
      });
    } catch (error) {
      Logger.error(`Failed to create posting. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: String(newPosting.id),
      // TODO: need BranchDTO
      // branch: Branch;
      // shifts: Shift[];
      // skills: PostingOnSkill[];
      employee: posting.employee,
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
    let updateResult: Posting | null;
    try {
      await prisma.posting.findUnique({
        where: {
          id: Number(postingId),
        },
      });
      updateResult = await prisma.posting.update({
        where: { id: Number(postingId) },
        data: {
          // TODO: need BranchDTO
          // branch: Branch;
          // shifts: Shift[];
          // skills: PostingOnSkill[];
          employee: posting.employee,
          title: posting.title,
          type: posting.type,
          description: posting.description,
          startDate: posting.startDate,
          endDate: posting.endDate,
          autoClosingDate: posting.autoClosingDate,
          numVolunteers: posting.numVolunteers,
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
      // TODO: need BranchDTO
      // branch: Branch;
      // shifts: Shift[];
      // skills: PostingOnSkill[];
      employee: posting.employee,
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
