import { useEffect, useState, useId } from "react"
import { 
    TokyoGameClient as TokyoClient, 
    Gamepad, 
} from "tokyoclient-ts"

interface UseTokyoGameClientParams {
    onConnectSucceed?: () => void
    eventHandler?: () => void
    allowConnect?: boolean
    userName: string
}

export const useTokyoGameClient = ({
    userName,
    allowConnect=true
}: UseTokyoGameClientParams) => {
    const [ gamepad, setGamepad ] = useState<Gamepad>()
    const [ isFirstLoading, setIsFirstLoading ] = useState(true)
    const id = useId()

    const createGameClient = () => {
        if (!allowConnect) return
        const client = new TokyoClient({
            serverHost: "combat.sege.dev",
            apiKey: "webuild",
            useHttps: true,
            userName: userName + "_" + id
        })
        client.setOnOpenFn(() => setIsFirstLoading(false))
        setGamepad(client.GamePad())
        console.log("created client")
    }
    useEffect(createGameClient, [allowConnect, userName, id])

    return {
        controller: gamepad,
        isFirstLoading,
    }
}

