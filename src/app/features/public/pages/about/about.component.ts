import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [
    NgClass,
    RouterLink
  ],
  templateUrl: './about.component.html',
  standalone: true,
  styleUrl: './about.component.css'
})
export class AboutComponent {
  teamMembers = [
    {
      name: "Mr. ABD-ELHAQ AZROUR",
      role: "Founder & CEO",
      bio: "Mr. Azrour founded ShareHope after recognizing the challenges in healthcare accessibility in Morocco and across North Africa, using his background in medical research and leadership.",
      image: "https://res.cloudinary.com/dofubyjcd/image/upload/v1742452079/shareHope/users/ofpqnnciobnatqr6cwhw.jpg",
    },
    {
      name: "Snini Ayoub",
      role: "Chief Operations Officer",
      bio: "With expertise in nonprofit management, Ayoub oversees daily operations and strategic partnerships, ensuring ShareHope’s mission is carried out effectively across Morocco.",
      image: "https://intranet.youcode.ma/storage/users/profile/792-1696615701.jpg",
    },
    {
      name: "Jammar Maryam",
      role: "Medical Director",
      bio: "Jammar evaluates medical aid requests and collaborates with local healthcare providers to ensure that resources are allocated where they are needed the most.",
      image: "https://intranet.youcode.ma/storage/users/profile/783-1696615941.jpg",
    },
    {
      name: "Yassir Ait Lahmadi",
      role: "Technology Director",
      bio: "Yassir leads the technology team, focusing on building secure and efficient platforms to support ShareHope’s operations, ensuring accessibility for all.",
      image: "https://intranet.youcode.ma/storage/users/profile/958-1696615718.jpg",
    },
    {
      name: "Imane Bouabidi",
      role: "Community Outreach Director",
      bio: "Imane works closely with underserved communities to build partnerships and programs aimed at increasing healthcare accessibility and awareness throughout Morocco.",
      image: "https://intranet.youcode.ma/storage/users/profile/720-1696417142.jpg",
    },
    {
      name: "Aymane El Maini",
      role: "Financial Director",
      bio: "Aymane ensures that ShareHope’s finances are managed with transparency and accountability, optimizing the use of every donation to maximize its impact.",
      image: "https://intranet.youcode.ma/storage/users/profile/775-1696615133.jpg",
    },
  ]

  // Core values
  coreValues = [
    {
      title: "Compassion",
      description:
        "We believe in treating everyone with dignity and respect, recognizing the inherent worth of each individual.",
      icon: "heart",
    },
    {
      title: "Transparency",
      description:
        "We maintain open communication about our operations, finances, and impact to build trust with our community.",
      icon: "eye",
    },
    {
      title: "Equity",
      description:
        "We are committed to fair distribution of medical resources, prioritizing those with the greatest need.",
      icon: "scale",
    },
    {
      title: "Innovation",
      description:
        "We continuously seek creative solutions to healthcare challenges, leveraging technology to maximize our impact.",
      icon: "lightbulb",
    },
  ]

  // Milestones
  milestones = [
    {
      year: 2015,
      title: "Foundation",
      description:
        "ShareHope was founded by Dr. Sarah Johnson after her experiences providing medical care in underserved regions.",
    },
    {
      year: 2017,
      title: "First Major Partnership",
      description: "Partnered with Global Health Initiative to expand our reach to 5 additional countries.",
    },
    {
      year: 2019,
      title: "Platform Launch",
      description:
        "Launched our digital platform, connecting donors directly with individuals and communities in need.",
    },
    {
      year: 2020,
      title: "COVID-19 Response",
      description:
        "Mobilized resources to provide emergency medical supplies to communities heavily impacted by the pandemic.",
    },
    {
      year: 2022,
      title: "Expansion",
      description: "Reached our 10,000th beneficiary and expanded operations to 25 countries worldwide.",
    },
    {
      year: 2023,
      title: "Innovation Award",
      description: "Received the Global Healthcare Innovation Award for our transparent and efficient donation model.",
    },
  ]

  // FAQs
  faqs = [
    {
      question: "How does ShareHope ensure donations reach those in need?",
      answer:
        "We maintain a rigorous verification process for all medical aid requests and work directly with healthcare providers to ensure resources reach intended recipients. Our platform provides real-time tracking and updates on donation impact.",
      isOpen: false,
    },
    {
      question: "What percentage of my donation goes directly to medical aid?",
      answer:
        "At least 85% of every donation goes directly to medical aid. The remaining 15% covers essential operational costs, including platform maintenance, security, and verification processes.",
      isOpen: false,
    },
    {
      question: "Can I donate to a specific cause or individual?",
      answer:
        "Yes! Our platform allows you to browse specific medical aid requests and direct your donation to causes that resonate with you personally.",
      isOpen: false,
    },
    {
      question: "Is my donation tax-deductible?",
      answer:
        "Yes, ShareHope is a registered 501(c)(3) nonprofit organization, and all donations are tax-deductible to the extent allowed by law.",
      isOpen: false,
    },
    {
      question: "How can I get involved beyond making a donation?",
      answer:
        "There are many ways to support our mission! You can volunteer your skills, share success stories on social media, organize fundraising events, or if you're a healthcare professional, provide expert consultation.",
      isOpen: false,
    },
  ]

  // Toggle FAQ
  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen
  }
}
