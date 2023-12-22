import type { Context } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';

export default async (req: Request, context: Context) => {
  console.log(req, context);
  console.log(nodemailer);
  console.log(MongoClient);
  return new Response('Hello, world!');
};
