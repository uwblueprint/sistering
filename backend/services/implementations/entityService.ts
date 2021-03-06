import { v4 as uuidv4 } from "uuid";

import { PrismaClient, Entity } from "@prisma/client";
import {
  IEntityService,
  EntityRequestDTO,
  EntityResponseDTO,
} from "../interfaces/entityService";
import IFileStorageService from "../interfaces/fileStorageService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class EntityService implements IEntityService {
  storageService: IFileStorageService;

  constructor(storageService: IFileStorageService) {
    this.storageService = storageService;
  }

  /* eslint-disable class-methods-use-this */
  async getEntity(id: string): Promise<EntityResponseDTO> {
    let entity: Entity | null;
    try {
      entity = await prisma.entity.findUnique({
        where: { id: Number(id) },
      });
      if (!entity) {
        throw new Error(`Entity id ${id} not found`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get entity. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: String(entity.id),
      stringField: entity.stringField,
      intField: entity.intField,
      enumField: entity.enumField,
      stringArrayField: entity.stringArrayField,
      boolField: entity.boolField,
      fileName: entity.fileName,
    };
  }

  async getEntities(): Promise<EntityResponseDTO[]> {
    try {
      const entities: Array<Entity> = await prisma.entity.findMany();
      return entities.map((entity) => ({
        id: String(entity.id),
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
        fileName: entity.fileName,
      }));
    } catch (error: unknown) {
      Logger.error(
        `Failed to get entities. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO> {
    let newEntity: Entity | null;
    const fileName = entity.filePath ? uuidv4() : "";
    try {
      if (entity.filePath) {
        await this.storageService.createFile(
          fileName,
          entity.filePath,
          entity.fileContentType,
        );
      }
      newEntity = await prisma.entity.create({
        data: {
          stringField: entity.stringField,
          intField: entity.intField,
          enumField: entity.enumField,
          stringArrayField: entity.stringArrayField,
          boolField: entity.boolField,
          fileName,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to create entity. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(newEntity.id),
      stringField: newEntity.stringField,
      intField: newEntity.intField,
      enumField: newEntity.enumField,
      stringArrayField: newEntity.stringArrayField,
      boolField: newEntity.boolField,
      fileName,
    };
  }

  async updateEntity(
    id: string,
    entity: EntityRequestDTO,
  ): Promise<EntityResponseDTO | null> {
    let updateResult: Entity | null;
    let fileName = "";
    try {
      const currentEntity = await prisma.entity.findUnique({
        where: {
          id: Number(id),
        },
      });
      const currentFileName = currentEntity?.fileName;
      if (entity.filePath) {
        fileName = currentFileName || uuidv4();
        if (currentFileName) {
          await this.storageService.updateFile(
            fileName,
            entity.filePath,
            entity.fileContentType,
          );
        } else {
          await this.storageService.createFile(
            fileName,
            entity.filePath,
            entity.fileContentType,
          );
        }
      } else if (currentFileName) {
        await this.storageService.deleteFile(currentFileName);
      }
      updateResult = await prisma.entity.update({
        where: { id: Number(id) },
        data: {
          stringField: entity.stringField,
          intField: entity.intField,
          enumField: entity.enumField,
          stringArrayField: entity.stringArrayField,
          boolField: entity.boolField,
          fileName,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to update entity. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(updateResult.id),
      stringField: updateResult.stringField,
      intField: updateResult.intField,
      enumField: updateResult.enumField,
      stringArrayField: updateResult.stringArrayField,
      boolField: updateResult.boolField,
      fileName,
    };
  }

  async deleteEntity(id: string): Promise<void> {
    try {
      const deleteResult: Entity = await prisma.entity.delete({
        where: { id: Number(id) },
      });

      if (deleteResult.fileName) {
        await this.storageService.deleteFile(deleteResult.fileName);
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete entity. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default EntityService;
