import { CakeIcon, BuildingLibraryIcon, MapPinIcon, QuestionMarkCircleIcon, EnvelopeIcon, PhoneIcon  } from '@heroicons/react/24/outline'

type Props = {
    category: 'school' | 'location' | 'gender' | 'dob' | 'contact' | 'email', 
    detail: string
}

export const MiniDetail = ({category, detail}: Props) => {
    const iconClass='h-5 text-[#2D84C4] sm:h-6! sm:w-6! '
    return (
        <div className='flex gap-2 items-center'>
            {
                category === 'school' ? <BuildingLibraryIcon className={iconClass}/> :
                category === 'location' ? <MapPinIcon className={iconClass}/> :
                category === 'dob' ? <CakeIcon className={iconClass}/> :
                category === 'gender' ? <QuestionMarkCircleIcon className={iconClass}/> :
                category === 'contact' ? <PhoneIcon className={iconClass}/> :
                category === 'email' ? <EnvelopeIcon className={iconClass}/> :
                ''
            }
            <div className='flex flex-col gap-1'>
                <span className='text-xs text-gray-500'>
                    {
                        category === 'school' ? 'SCHOOL' :
                        category ==='location' ? 'LOCATION' :
                        category === 'dob' ? 'DATE OF BIRTH' :
                        category === 'gender' ? 'GENDER' :
                        category === 'email' ? 'EMAIL' :
                        category === 'contact' ? 'CONTACT' :
                        ''
                    }
                </span>
                <span className='text-md'>
                    {detail}
                </span>
            </div>
        </div>
    )
}