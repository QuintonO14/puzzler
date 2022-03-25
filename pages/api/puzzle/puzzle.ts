// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body
  const puzzle = await prisma.puzzle.findFirst({
    where: {
      userId: body.id,
      image: body.image
    }
  })

  if(!puzzle) {
  const p = await prisma.puzzle.create({
      data: {
        userId: body.userId,
        image: body.image,
        easy: body.easy,
        medium: body.medium,
        hard: body.hard,
        extrahard: body.extrahard
      }
  })
  res.status(200).send({created : p})
  } else {
    const p = await prisma.puzzle.update({
      where: {
        id: puzzle.id
      },
      data: {
         easy: {
           increment: body.easy
         },
         medium: {
           increment: body.medium
         },
         hard: {
           increment: body.hard
         },
         extrahard: {
           increment: body.extrahard
         }
      }
    })
  res.status(200).json({updated : p})
  }
  res.end() 
}
