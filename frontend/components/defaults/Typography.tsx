type Props = {
    text: string,
    classNames: string
}

export const H1 = ({text, classNames}: Props) => {
    return (
    <h1 className={`scroll-m-20 mb-5 text-left text-4xl font-extrabold tracking-tight text-balance  text-[#2D84C4] ${classNames}`}>
      {text}
    </h1>
    )
}

export const H2 = ({text, classNames}: Props) => {
    return (
    <h2 className={`scroll-m-20 mb-5 text-left text-2xl font-bold tracking-tight text-balance  text-[#2D84C4] ${classNames}`}>
      {text}
    </h2>
    )
}

export const H3 = ({text, classNames}: Props) => {
    return (
    <h3 className={`scroll-m-20 mb-5 text-left text-lg font-bold tracking-tight text-balance  text-[#2D84C4] ${classNames}`}>
      {text}
    </h3>
    )
}

export const H4 = ({text, classNames}: Props) => {
    return (
    <h3 className={`scroll-m-20 mb-5 text-left text-md font-bold tracking-tight text-balance  text-[#2D84C4] ${classNames}`}>
      {text}
    </h3>
    )
}

export const H5 = ({text, classNames}: Props) => {
    return (
    <h3 className={`scroll-m-20 mb-5 text-left text-sm font-medium tracking-tight text-balance  text-[#2D84C4] ${classNames}`}>
      {text}
    </h3>
    )
}

export const PG = ({text, classNames}: Props) => {
  return (
    <p className={`leading-7 not-first:mt-6 text-black ${classNames}`}>
      {text}
    </p>
  )
}