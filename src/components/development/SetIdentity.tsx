import Card from './card'
import { SERVER_ADDRESS } from '@/types/constants';
import axios from 'axios';
import { type } from 'os';
import React, { useEffect, useState } from 'react'

type SetIdentityProps = {
    handleSetIdentity: () => void
    handleIdentiyChange: (identity: any) => void
}

const SetIdentity = ({ handleSetIdentity }: SetIdentityProps) => {

    const [identities, setIdentities] = useState<string[]>([])
    const [selectedIdentity, setSelectedIdentity] = useState<string>('')

    useEffect(() => {
        try {
            axios.get(`${SERVER_ADDRESS}/get_all_identities`).then((response) => {
                setIdentities(response.data.data)
                console.log(response.data.data)
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    return (
        <div className='w-full h-full fixed bg-white-100/20'>
            {!!identities && identities.map((identity) => {
                return (
                    <Card className='flex flex-row justify-between items-center'>
                        <p>{identity}</p>
                        <button onClick={() => setSelectedIdentity(identity)}>Select</button>
                    </Card>
                )
            })}
        </div>
    )
}
export default SetIdentity