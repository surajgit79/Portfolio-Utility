'use client';

import { Button } from "../ui/button";

export const Footer = () => {
    return (
        <div className="bg-black text-white p-10 mt-10">
            <div className='grid md:grid-cols-3 sm:grid-cols-1 md:gap-5'>
                 <div>
                    <h1 className="text-lg font-bold my-2.5">Navodaya Education Innovation Center</h1>
                    <p>Transforming Education</p>
                 </div>
                 <div>
                    <h1 className="text-lg font-bold my-2.5">Contact</h1>
                    <p>9851049735 / 9862093365</p>
                    <p className="mt-1">
                        <a href="#" target='blank'>nic@navodaya.edu.np</a>
                    </p>
                 </div>
                 <div>
                    <h1 className="text-lg font-bold my-2.5">Location</h1>
                    <p>C29J+PW9, Prajatantrik Marg, Hetauda 44107</p>
                    <Button className="bg-white text-black p-2 mt-2 border rounded-none hover:bg-[#2D84C4] hover:text-white " >
                        <a href="https://maps.app.goo.gl/37cR2EEAEckVDEKUA" target="blank">Open in Google Maps</a>
                    </Button>
                 </div>
            </div>
        </div>
    )
}