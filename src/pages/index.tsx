import Head from "next/head";
import { api } from "~/utils/api";
// t3- https://www.youtube.com/watch?v=J1gzN1SAhyM
// embeddings and chatbot- https://www.youtube.com/watch?v=RM-v7zoYQo0
export default function Home() {
  const create = api.openAi.createEmbeddings.useMutation({
    onSuccess: (data) => {
      console.log("data", data);
      return data;
    },
  });

  const get = api.openAi.getClosestEmbeddings.useMutation({
    onSuccess: (data) => {
      console.log("data", data);
      return data;
    },
  });

  const test = () => {
    create.mutate({
      text_date: " z.string()",
      text_url: "z.string()",
      text_title: "z.string()",
      text: `Bacon ipsum dolor amet short ribs andouille ball tip biltong cow, corned beef doner swine shankle chicken pork kevin pig drumstick. Pork loin alcatra tail flank, strip steak tri-tip pig shoulder pastrami porchetta frankfurter hamburger ham. Meatloaf rump leberkas, venison short ribs meatball sirloin salami. Pork belly turkey hamburger pig chicken landjaeger pancetta prosciutto. Drumstick brisket tail, hamburger ball tip kevin tenderloin. Picanha short loin flank cupim pancetta pork shankle pastrami prosciutto. Strip steak spare ribs jowl venison tail shank sirloin chicken prosciutto leberkas cupim buffalo t-bone rump. Ham t-bone turkey, leberkas pork chop ribeye sirloin. Venison hamburger spare ribs jowl, pig shankle buffalo pork. Venison alcatra meatball sirloin flank chuck kielbasa frankfurter pork chop corned beef. Salami short loin picanha kielbasa spare ribs meatball alcatra. Short loin sirloin boudin turkey bresaola salami. Ground round chislic pig venison pork loin tri-tip, t-bone ball tip. Meatloaf kielbasa turducken shoulder cupim, swine hamburger. Burgdoggen kevin short loin corned beef tongue. Brisket kevin bacon jowl venison corned beef porchetta tongue hamburger beef chuck tri-tip. Andouille chuck beef ribs shoulder, pig filet mignon porchetta pork belly chicken tail kevin beef pork turkey. Jowl turkey short ribs leberkas, sirloin pancetta ball tip fatback biltong salami pork. Pork belly filet mignon ham, swine ground round bresaola burgdoggen ribeye beef shankle salami pork loin jerky chicken cupim. Flank shankle jerky frankfurter. Drumstick andouille hamburger flank. Porchetta ham tenderloin leberkas tri-tip frankfurter. Pork loin ribeye filet mignon burgdoggen, buffalo beef ribs jerky meatloaf ball tip tongue cow jowl. Sausage rump beef boudin filet mignon, tail ball tip pork chicken sirloin chuck. Filet mignon ground round ribeye, cupim turducken pork loin tongue pig sirloin. Drumstick boudin kielbasa pancetta swine. Kielbasa boudin short ribs doner shank filet mignon tenderloin hamburger strip steak beef pork belly pancetta porchetta. Buffalo shank kevin, leberkas salami pork pig. Short loin drumstick shank sirloin alcatra, pancetta meatloaf pork kevin beef capicola shoulder chicken. Sirloin bresaola t-bone rump, tenderloin shankle porchetta biltong picanha cupim shank corned beef brisket. Kevin shank bresaola burgdoggen chicken pork loin meatball ham hock. Kevin biltong cupim pancetta pastrami pork chop jerky rump pork loin chislic. Sausage tongue bresaola meatloaf, bacon cow turkey short ribs pork belly. Tenderloin chuck leberkas andouille chislic. Jowl buffalo pork loin andouille corned beef frankfurter leberkas short ribs pastrami spare ribs biltong pork swine. Sirloin beef ground round, biltong tail bacon cupim ball tip pork belly meatloaf jowl pig. Filet mignon prosciutto ham hock shankle ham kielbasa ribeye beef ribs tail ground round turducken. Tenderloin meatball frankfurter flank chuck. Chicken picanha swine beef, leberkas bresaola ham hock burgdoggen hamburger ground round prosciutto shoulder. Landjaeger t-bone jowl chislic, pastrami meatloaf ham ground round. Ham ground round ball tip, jerky cow tail pancetta flank tongue. Prosciutto short loin buffalo tongue boudin strip steak cow turkey andouille chicken short ribs rump bresaola pork belly picanha. Drumstick meatloaf burgdoggen chuck venison cupim. Chuck alcatra fatback, meatloaf pork chop shoulder tongue pork belly ground round filet mignon turducken. Shankle corned beef pork, buffalo pancetta biltong doner tail tenderloin cow hamburger bacon. Spare ribs ball tip shoulder ribeye. Landjaeger bacon andouille tri-tip short ribs. Kielbasa pig burgdoggen, porchetta frankfurter cow andouille drumstick bresaola flank brisket chislic turducken. Landjaeger doner short loin ham hock. Bresaola fatback buffalo chislic.`,
    });
    console.log("done");

    // get.mutate({
    //   text: "Cause: When you exec prisma migrate reset or prisma migrate dev in the remote Supabase database you may need to reset it. Resetting the database drops the whole database and recreates it",
    // });
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-gray-700">Welcome to T3!</p>
          <button className="btn" onClick={() => test()}>
            Test API
          </button>
        </div>
      </div>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
