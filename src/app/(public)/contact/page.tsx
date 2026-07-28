export const dynamic = "force-dynamic";

import React from "react";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import { connectToDatabase } from "@/lib/mongodb";
import { GlobalSettings } from "@/models/GlobalSettings";
import ContactClient from "./ContactClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "contact",
    "Contact & Inquiries | Rana Masud",
    "Get in touch with film director Rana Masud for business inquiries, film projects, training, or collaboration."
  );
}

export default async function ContactPage() {
  const pageData = await getPageBySlug("contact");

  // Fetch phone, email, address, and socials from Global Settings
  let email = "info@ranamasudbd.com";
  let emailFallback = "ranaferywala@gmail.com";
  let phone = "+8801711704545";
  let address = "Block: A, Road: 02, House: 73, Flat: A/9, Niketon, Dhaka, Bangladesh.";
  let socials = {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    imdb: "https://www.imdb.com/name/nm7851085/",
  };

  try {
    await connectToDatabase();
    const footerDoc = await GlobalSettings.findOne({ key: "footer" }).lean();
    if (footerDoc && (footerDoc as any).data) {
      const fd = (footerDoc as any).data;
      if (fd.contactEmail) email = fd.contactEmail;
      if (fd.contactPhone) phone = fd.contactPhone;
      if (fd.address) address = fd.address;
      if (fd.socials) socials = fd.socials;
    }
  } catch (error) {
    console.error("Failed to load contact info from GlobalSettings:", error);
  }

  const fm = pageData?.frontmatter || {};
  const headerText =
    fm.headerText ||
    "Get in touch for film production details, commercial TVC creations, speaking assignments, or academic training opportunities.";

  return (
    <ContactClient
      email={email}
      emailFallback={emailFallback}
      phone={phone}
      address={address}
      socials={socials}
      headerText={headerText}
      badgeText={fm.badgeText}
      titleText={fm.titleText}
      officeTitle={fm.officeTitle}
      addressLabel={fm.addressLabel}
      emailLabel={fm.emailLabel}
      phoneLabel={fm.phoneLabel}
      socialLabel={fm.socialLabel}
      formTitle={fm.formTitle}
      formNameLabel={fm.formNameLabel}
      formEmailLabel={fm.formEmailLabel}
      formSubjectLabel={fm.formSubjectLabel}
      formMessageLabel={fm.formMessageLabel}
      formButtonText={fm.formButtonText}
      formSuccessTitle={fm.formSuccessTitle}
      formSuccessText={fm.formSuccessText}
    />
  );
}
