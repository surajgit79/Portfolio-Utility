'use client';

export const Footer = () => {
    return (
        <div className="bg-black text-white p-10 mt-10">
            <div className='grid md:grid-cols-3 sm:grid-cols-1'>
                 <div>
                    <h1 className="text-xl">Navodaya Education Innovation Center</h1>
                    <p>Transforming Education</p>
                 </div>
                 <div>
                    <h1>Contact</h1>
                    <p>9851049735 / 9862093365</p>
                    <p>nic@navodaya.edu.np</p>
                 </div>
                 <div>
                    <h1>Location</h1>
                    <p>C29J+PW9, Prajatantrik Marg, Hetauda 44107</p>
                    <p>Open in Google Maps</p>
                 </div>
            </div>
        </div>
    )
}