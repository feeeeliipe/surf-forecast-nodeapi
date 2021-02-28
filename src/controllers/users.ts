import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '../models/user';

@Controller('users')
export class UsersController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      res
        .status(500)
        .send({ error: 'Something went wrong processing forecast' });
    }
  }
}
