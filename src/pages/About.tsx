import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

const teamMembers = [
  {
    name: "Hossen Mohammed",
    role: "Founder / AI Engineer",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    links: {
      website: "https://mazin-emad.netlify.app",
      github: "https://www.github.com",
      x: "https://www.x.com",
    },
  },
  {
    name: "Mazin Emad",
    role: "Frontend Developer",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    links: {
      website: "https://mazin-emad.netlify.app",
      github: "https://www.github.com",
      x: "https://www.x.com",
    },
  },
  {
    name: "Esmail Mohamed",
    role: "FullStack Developer",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    links: {
      website: "https://mazin-emad.netlify.app",
      github: "https://www.github.com",
      x: "https://www.x.com",
    },
  },
  {
    name: "Eslam Mohamed",
    role: "FullStack developer",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    links: {
      website: "https://mazin-emad.netlify.app",
      github: "https://www.github.com",
      x: "https://www.x.com",
    },
  },
];

const SocialLinks = ({
  links,
}: {
  links: { website: string; github: string; x: string };
}) => (
  <div className="flex mt-3 -mx-2">
    <a
      href={links.x}
      target="_blank"
      className="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 group-hover:text-white"
      aria-label="X"
    >
      <FaXTwitter className="size-5" />
    </a>
    <a
      href={links.website}
      target="_blank"
      className="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 group-hover:text-white"
      aria-label="Website"
    >
      <CgProfile className="size-5" />
    </a>
    <a
      href={links.github}
      target="_blank"
      className="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 group-hover:text-white"
      aria-label="Github"
    >
      <FaGithub className="size-5" />
    </a>
  </div>
);

export default function About() {
  return (
    <section className="bg-primary/10">
      <div className="container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
          Our Executive Team
        </h1>

        <p className="max-w-2xl mx-auto my-6 text-center text-gray-500 dark:text-gray-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo incidunt
          ex placeat modi magni quia error alias, adipisci rem similique, at
          omnis eligendi optio eos harum.
        </p>

        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-8 rounded-xl"
            >
              <img
                className="object-cover w-32 h-32 rounded-full ring-4 ring-gray-300"
                src={member.image}
                alt={member.name}
              />

              <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-white">
                {member.name}
              </h1>

              <p className="mt-2 text-gray-500 capitalize dark:text-gray-300">
                {member.role}
              </p>

              <SocialLinks links={member.links} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
