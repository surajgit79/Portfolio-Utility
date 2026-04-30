import { sign } from "crypto"

type Signatories = {
  leftName?: string
  leftDesignation?: string
  leftSignature?: string | undefined
  rightName?: string
  rightDesignation?: string
  rightSignature?: string | undefined
}

type CertificateProps = {
  teacherName?: string
  programTitle?: string
  topics?: string[]
  certificateId?: string
  signatories?: Signatories
  issuedDate?: string
}

export default function Certificate({
  teacherName = 'Sita Lamsal',
  programTitle = 'ABM Co-ordinator',
  topics = ['Arithmetic', 'Algebra', 'Geometry'],
  signatories = {
    leftName: 'Abyekta Khanal',
    leftDesignation: 'Chief Executive Officer',
    leftSignature: 'https://camo.githubusercontent.com/735a0a4e23fbae48c85c13cf7a76075358dc77cf95d6a2cf1b2c051b85056339/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f393837332f3236383034362f39636564333435342d386566632d313165322d383136652d6139623137306135313030342e706e67',
    rightName: 'Suraj Gupta',
    rightDesignation: 'Coordinator',
    rightSignature: 'https://onlinepngtools.com/images/examples-onlinepngtools/george-walker-bush-signature.png',
  },
  certificateId = '0011AA',
  issuedDate = '2026/01/01',
}: CertificateProps) {
  const formattedIssuedDate = new Date(issuedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto flex h-[700] w-[991] overflow-hidden bg-white font-sans shadow  border-t-[20] border-[#2D84C4]">
      <aside className="relative w-[200] shrink-0 bg-white">
        <div className="h-full border-r border-[#eee]">
          {/* <div className='bg-[#2D84C4] h-5 z-100'/> */}
          <div className="absolute top-0 left-1/4 z-0 h-full w-1/2 bg-[#2D84C4]" />
          <img
            className="absolute left-0 z-10 w-[99%] bg-white object-contain"
            src="/logoTransparantBG.svg"
            alt="Logo"
          />

          <div className="absolute left-1/2 bottom-[3.5%] z-10 h-[115] w-[115] -translate-x-1/2 rounded-full bg-white" >
            <img
              src='/certificateMedalPlaceholder.png'
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-[60] w-full bg-[#2D84C4]" />
      </aside>
      <main className="flex flex-1 flex-col gap-0">
        <section className="flex items-start gap-5 border-b border-[#eee] px-10 pb-5 pt-8">
          <div className="flex-1">
            
            <p className="mb-1.5 text-[13px] text-[#555]">
              <span className='font-medium '>Navodaya Education Innovation Center</span> presents this
            </p>
            <h1 className="font-serif text-[28px] font-bold tracking-[1px] text-[#1a6eb5]">
              CERTIFICATE OF COMPLETION
            </h1>
          </div>
        </section>

        <section className="flex-1 px-10 pt-5 max-h-90">
          <p className="mb-2 text-[13px] text-[#555]">to</p>

          <h2 className="mb-3 font-serif text-[42px] font-bold text-[#2c2c2c]">
            {teacherName}
          </h2>

          <p className="mb-4 text-sm italic text-[#555]">
            for completing {programTitle}
          </p>

          <ul className="mb-5 space-y-1.5 h-30 max-h-30 overflow-hidden grid grid-rows-4 grid-cols-3 grid-flow-col">
            {topics.map((topic) => (
              <li
                key={topic}
                className="flex items-center gap-2 text-[13px] text-[#444] row-span-1 col-span-1"
              >
                <span className="text-base font-bold text-[#1a6eb5]">•</span>
                {topic}
              </li>
            ))}
          </ul>
        </section>
        
        <section className="flex items-end justify-between px-10 pb-8">
          <div className="min-w-35 text-center">
            <div className="mb-1.5 h-12.5 w-40 border-b-[1.5px] border-[#1a6eb5] flex items-center" >
              <img src={signatories.leftSignature} alt='Signature' className="max-w-full min-w-full w-full object-fit " />
            </div>
            <p className="text-[13px] font-semibold text-[#2c2c2c]">
              {signatories.leftName}
            </p>
            <p className="text-[11px] text-[#777]">
              {signatories.leftDesignation}
            </p>
          </div>

          <div className="min-w-35 text-center">
            <div className="mb-1.5 h-12.5 w-40 border-b-[1.5px] border-[#1a6eb5] flex items-center">
              <img src={signatories.rightSignature} alt='Signature' className="max-w-full min-w-full w-full object-fit " />
            </div>
            <p className="text-[13px] font-semibold text-[#2c2c2c]">
              {signatories.rightName}
            </p>
            <p className="text-[11px] text-[#777]">
              {signatories.rightDesignation}
            </p>
          </div>

          <div className="text-center">
            <p className="mb-1 text-[10px] text-[#777]">
              ID: {certificateId}
            </p>
            <img
              className="h-25 w-25"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoPz367058IX4vnnNg1slLN8Icl7tpckPDRA&s"
              alt="QR Code"
            />
            <p className="mt-1.5 text-[11px] text-[#797979] font-semibold">
              Certificate Issued
              <br />
              <strong className="font-bold text-[#535353]">
                {formattedIssuedDate}
              </strong>
            </p>
          </div>
        </section>
        <div className="h-[60] shrink-0 bg-[#2D84C4]" />
      </main>
    </div>
  )
}