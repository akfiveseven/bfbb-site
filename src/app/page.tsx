import { CenteredContainer } from "@/components/layout/CenteredContainer";
import Link from 'next/link'
export default function Home() {
  const Header = ({ label, className }: { label: string, className: string }) => {
    return (
      <h1
        className={`font-bob text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl
${className ? className : ''}`}
      >
        {label}
      </h1>
    );
  };
  const PageLink = ({ label, route }: { label: string, route: string }) => {
    return (
      <Link href={route}>
        <p
          className='
          text-yellow 
          p-2 
          lg:!p-7 
          lg:inline 
          font-bob 
          lg:!text-2xl 
          lg:!mt-[0px]
          xl:!text-3xl
          '
        >
          {label}
        </p>
      </Link>
    );
  };


  return (
    <div>
      <CenteredContainer className="!items-center justify-center text-center">

        <div className='animate-fade-in-up'>

          <div>
            <Header
              label='Battle for Bikini Bottom'
              className='pb-1 text-2xl lg:!text-6xl lg:pb-4 md:!text-4xl font-yellow'
            />
            <Header
              label='Community Website'
              className='
              !font-mono 
              text-[#CCCCCC] 
              pb-4 
              lg:!text-4xl 
              lg:!pb-24 
              md:!text-2xl
              '
            /> 
          </div>

          <div className='font-bob lg:!text-2xl lg:!mt-[0px] xl:!text-3xl'>
            <PageLink label='Leaderboards' route='https://www.speedrun.com/bfbb' />
            <PageLink label='Discord' route='https://discord.gg/8BKC3US' />
            {/* <PageLink label='Forums' route='#' /> */}
            {/* <PageLink label='Route Builder' route='#' /> */}
          </div>

        </div>
      </CenteredContainer>
      {/*
      <ContentContainer>
        <hr />
        <br />
        <br />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h1 className='font-bob text-md md:text-xl text-center mb-8 md:mb-16'>
            About
            </h1>
            <p className=''>
              The SpongeBob SquarePants: Battle for Bikini Bottom (2003)
              speedrunning community is a dedicated group of gamers and
              enthusiasts who focus on completing the game as quickly as
              possible. This website acts as a hub for new and returning
              players to learn new strats, routes, and optimizations.
            </p>
            <br />
            <p className=''>
              The community has grown significantly over the years, bringing
              together players from around the world who share a passion for
              optimizing gameplay, discovering glitches, and mastering
              intricate techniques to achieve the fastest times. The
              speedrunning scene for this beloved platformer is characterized
              by its collaborative spirit, with runners frequently sharing
              strategies, routing tips, and new discoveries through forums,
              Discord channels, live streaming platforms, and now, this
              website.
            </p>
            <br />
            <p className=''>
              Community-organized events and competitions, such as marathons
              and races, further enhance the camaraderie and excitement
              within this vibrant community, celebrating not just the game
              itself but the collective effort to push the boundaries of what
              is possible in speedrunning.
            </p>
          </div>
          <div>
            <h1 className='font-bob text-md md:text-xl text-center mb-8 md:mb-24'>
            Any% World Record
            </h1>
            <iframe width="560" height="315" className="rounded-xl text-center m-auto w-76 h-64 md:w-128" src="https://www.youtube.com/embed/Hgi2SakLPxg?si=JncDzlQMsg7tDuQO&amp;start=2256" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
        </div>
      </ContentContainer>
      */}
      {/* <iframe width="560" height="315" className="rounded-xl text-center m-auto w-76 h-64 md:w-128" src="https://www.youtube.com/embed/Hgi2SakLPxg?si=oz4kcekzn45QIxG7" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> */}
    </div>
  );
}
