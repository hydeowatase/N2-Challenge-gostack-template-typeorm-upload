import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type))
      throw new AppError('Tipo da transação inválida!');

    const transactionsRepository = getCustomRepository(TransactionRepository);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value)
      throw new AppError('Saldo insuficiente!');

    const categoryService = new CreateCategoryService();

    const categoryN = await categoryService.execute({ title: category });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryN.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
