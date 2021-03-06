// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const checkCategoryExist = await categoriesRepository.findOne({
      where: { title },
    });

    if (checkCategoryExist) return checkCategoryExist;

    const category = categoriesRepository.create({
      title,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
