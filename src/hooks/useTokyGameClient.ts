import { useEffect, useRef, useState, useId } from "react"
import type { Gamepad, EventKit, IConfig } from "tokyoclient-ts"
import { TokyoGameClient as TokyoClient } from "tokyoclient-ts"

const CONFIG: Omit<IConfig, 'userName'> = {
    serverHost: "combat.sege.dev",
    apiKey: "webuild0",
    useHttps: true
  }

interface UseTokyoGameClientParams {
    onConnectSucceed?: (_: Gamepad) => void
    eventHandler?: (_: EventKit) => void
    allowConnect?: boolean
    userName: string
}

export interface TokyoController {
    rotate: (_:number) => void
    fire: () => void
    throttle: (_: number) => void
}

export const useTokyoGameClient = ({
    userName,
    onConnectSucceed,
    eventHandler,
    allowConnect=true
}: UseTokyoGameClientParams) => {
    const [ client, setClient ] = useState<TokyoClient>()
    const [ isFirstLoading, setIsFirstLoading ] = useState(true)
    const id = useId()

    const connectSuccessRef = useRef(onConnectSucceed)
    const eventHandlerRef = useRef(eventHandler)

    const createGameClient = () => {
        if (!allowConnect) return

        const client = new TokyoClient({
            ...CONFIG,
            userName: userName + "_" + id
        })

        client.setOnOpenFn((gamepad: Gamepad) => {
            setIsFirstLoading(false)
            connectSuccessRef.current?.(gamepad)
        })
        client.setOnMessageFn((e: EventKit) => eventHandlerRef.current?.(e))

        setClient(client)

        console.log("created client")
    }

    useEffect(createGameClient, [allowConnect, userName, id])

    return {
        controller: client ? {
            rotate: client.rotate.bind(client),
            fire: client.fire.bind(client),
            throttle: client.throttle.bind(client),
        } as TokyoController: undefined,
        isFirstLoading
    }
}

