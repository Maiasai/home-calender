//サインアップAPI
import requireUser from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AuthProvider } from "generated/prisma"
import { NextRequest, NextResponse } from "next/server"

interface SignupRequestBody {
  nickname:string
  phoneNumber:string
}

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireUser()
    const body:SignupRequestBody = await request.json()

    const { nickname, phoneNumber } = body

    if (!nickname || typeof nickname !== 'string') {
      return NextResponse.json(
        { message: 'invalid nickname' }, 
        { status: 400 }
      )
    }

    if (phoneNumber && !/^[0-9]{11}$/.test(phoneNumber)) {
      return NextResponse.json(
        { message: 'invalid phone number' }, 
        { status: 400 }
      )
    }

    const rawProvider = user.app_metadata?.provider

    const provider: AuthProvider =
      rawProvider?.toLowerCase() === 'google'
        ? 'GOOGLE'
        : 'EMAIL'


    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        nickname,
        phoneNumber : phoneNumber ?? '',
        authProvider: provider
      }
      
    }
  )

    return NextResponse.json({ ok: true })
    
  } catch (error) {
    console.error(error)
    
    return NextResponse.json({ message: 'error' }, { status: 500 })
  }
}