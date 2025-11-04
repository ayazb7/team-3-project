import React from "react";
import {
  BadgeCheck,
  Code2,
  ShieldCheck,
  Bot,
  BarChart3,
  ClipboardCheck,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import jibrilHeadshot from "../assets/jibril_headshot.jpeg";
import ayazHeadshot from "../assets/ayaz_headshot.png";
import panyaHeadshot from "../assets/panya_headshot.jpeg";
import deeneshHeadshot from "../assets/deenesh_headshot.jpeg";
import karishmaHeadshot from "../assets/karishma_headshot.jpeg";
import anoHeadshot from "../assets/ano_headshot.jpeg";

function About() {
  const headshotClass =
    "w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-offset-2 ring-offset-background ring-white/40 dark:ring-white/30 saturate-95 contrast-95";
  const skills = [
    {
      title: "Digital Literacy",
      description:
        "Master core concepts like operating systems, files, networks, browsers, and productivity tools.",
      Icon: BadgeCheck,
    },
    {
      title: "Web Fundamentals",
      description:
        "Understand HTML, CSS, and JavaScript essentials to build clean, responsive web pages.",
      Icon: Code2,
    },
    {
      title: "Data Basics",
      description:
        "Work with data formats, simple transforms, and clear charts to communicate insights.",
      Icon: BarChart3,
    },
    {
      title: "Cybersecurity",
      description:
        "Stay safe online with password hygiene, MFA, phishing awareness, and privacy best practices.",
      Icon: ShieldCheck,
    },
    {
      title: "Online Communication",
      description:
        "Communicate clearly and professionally across email, chat, and collaborative tools.",
      Icon: MessageSquare,
    },
    {
      title: "Quizzes",
      description:
        "Reinforce learning with interactive quizzes and checkpoints along the way.",
      Icon: ClipboardCheck,
    },
  ];

  const team = [
    {
      name: "Ano Lawa",
      title: "Associate Software Engineer",
      skyToday:
        "https://skyglobal.sharepoint.com/sites/SkyToday/_layouts/15/search.aspx/overview?pp=9fba2eab-208a-49d1-aa15-4a5003bf9111%4068b865d5-cf18-4b2b-82a4-a4eddb9c5237%7Cano.lawa%40sky.uk",
      image: anoHeadshot,
    },
    {
      name: "Ayaz Baig",
      title: "Associate Software Engineer",
      skyToday:
        "https://skyglobal.sharepoint.com/sites/SkyToday/_layouts/15/search.aspx/overview?pp=8f61fdd2-f8ef-4909-9774-3e93d2fb0461%4068b865d5-cf18-4b2b-82a4-a4eddb9c5237%7Cmirza.baig%40sky.uk/",
      image: ayazHeadshot,
    },
    {
      name: "Panya Rattanarom",
      title: "Associate Software Engineer",
      skyToday:
        "https://skyglobal.sharepoint.com/sites/SkyToday/_layouts/15/search.aspx/overview?pp=8d6853ed-adcb-4f73-a86a-a63dd0073767%4068b865d5-cf18-4b2b-82a4-a4eddb9c5237%7Cpanya.rattanarom%40sky.uk",
      image: panyaHeadshot,
    },
    {
      name: "Deenesh Santheeswaran",
      title: "Cyber Security Graduate",
      skyToday:
        "https://skyglobal.sharepoint.com/sites/SkyToday/_layouts/15/search.aspx/overview?pp=75058e99-a7b2-46d1-88c5-082703308f2e%4068b865d5-cf18-4b2b-82a4-a4eddb9c5237%7Cdeenesh.santheeswaran%40sky.uk",
      image: deeneshHeadshot,
    },
    {
      name: "Karishma Vijay",
      title: "Technology Graduate",
      skyToday:
        "https://skyglobal.sharepoint.com/sites/SkyToday/_layouts/15/search.aspx/overview?pp=985067e2-241c-4cb8-8eb9-c9684aec3136%4068b865d5-cf18-4b2b-82a4-a4eddb9c5237%7Ckarishma.vijay%40sky.uk",
      image: karishmaHeadshot,
    },
    {
      name: "Jibril Abdi",
      title: "Associate Software Engineer",
      skyToday:
        "https://skyglobal.sharepoint.com/sites/SkyToday/_layouts/15/search.aspx/overview?pp=1f83ccf6-6967-4faa-acb6-25cfe0f35798%4068b865d5-cf18-4b2b-82a4-a4eddb9c5237%7Cjibril.abdi%40sky.uk",
      image: jibrilHeadshot,
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="text-center space-y-5">
          <h1 className="!text-6xl sm:!text-7xl font-extrabold tracking-tight font-urbanist sky-gradient-text">
            About Us
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our application is a modern, interactive learning platform that
            helps learners build practical technology skills through guided
            courses, step-by-step tutorials, and engaging quizzes. Track your
            progress, explore curated content, and grow your confidence with
            hands-on learning designed for beginners and upskillers alike.
          </p>
          <div className="h-1 w-32 mx-auto rounded sky-gradient" />
        </section>

        <section className="bg-white/50 dark:bg-white/10 backdrop-blur rounded-2xl border shadow-sm p-6 sm:p-8">
          <h2 className="!text-4xl sm:!text-5xl font-extrabold tracking-tight font-urbanist sky-gradient-text mb-2">
            Skills You&apos;ll Gain
          </h2>
          <div className="h-1 w-24 rounded sky-gradient mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="group relative rounded-2xl border bg-white/70 dark:bg-white/10 p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(120deg, rgba(255,138,1,0.12), rgba(172,30,196,0.12), rgba(28,80,254,0.12))",
                  }}
                />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff8a01] via-[#ac1ec4] to-[#1c50fe] text-white shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="!text-4xl sm:!text-5xl font-extrabold tracking-tight font-urbanist sky-gradient-text mb-2">
            Meet the Team
          </h2>
          <div className="h-1 w-24 rounded sky-gradient mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((person) => (
              <div
                key={person.name}
                className="rounded-2xl border bg-white/60 dark:bg-white/10 backdrop-blur p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <img
                  src={person.image || "/landing_placeholder.png"}
                  alt={`${person.name} headshot`}
                  className={headshotClass}
                />
                <h3 className="text-lg font-semibold">{person.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{person.title}</p>
                <a
                  href={person.skyToday}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:text-blue-700 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 underline underline-offset-4 decoration-blue-600/60 hover:decoration-blue-700 transition"
                >
                  Sky Today
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
