// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcrypt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body)
  const user: any = await prisma.user.findUnique({
  where: {
    username: body.username,
  }
  })

  if(user) {
    const valid = await bcrypt.compare(body.password, user.password)
    if(valid) {
      res.status(200).send(user)
    } else {
      res.status(400).send({invalid: 'invalid password'})
    }
  } else {
    const salt = await bcrypt.genSalt(12)
    body.password = await bcrypt.hash(body.password, salt)
    const user = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password
        }
    })
    res.status(200).send(user)
  }
   
}
