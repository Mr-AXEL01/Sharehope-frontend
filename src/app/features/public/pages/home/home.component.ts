import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  stats = [
    { label: "Donations Made", value: "2,500+", icon: "heart" },
    { label: "Lives Impacted", value: "10,000+", icon: "users" },
    { label: "Success Stories", value: "500+", icon: "star" },
    { label: "Countries Reached", value: "25+", icon: "globe" },
  ]

  // Featured success stories
  featuredStories = [
    {
      id: "1",
      title: "Sarah's Life-Saving Surgery",
      summary:
        "After struggling with a rare heart condition, Sarah received the surgery she needed thanks to generous donors.",
      image: "/articles/article1.jpg",
      author: "Medical Team",
      date: new Date(2023, 5, 15),
    },
    {
      id: "2",
      title: "Community Clinic in Rural Ghana",
      summary:
        "A new medical clinic was established in a remote village, providing healthcare access to over 5,000 people.",
      image: "/articles/article2.jpg",
      author: "Project Coordinator",
      date: new Date(2023, 7, 22),
    },
    {
      id: "3",
      title: "Emergency Response to Earthquake",
      summary: "Medical supplies and personnel were rapidly deployed to assist victims of a devastating earthquake.",
      image: "/placeholder.svg",
      author: "Relief Team",
      date: new Date(2023, 9, 5),
    },
  ]

  // How it works steps
  howItWorks = [
    {
      title: "Create an Account",
      description: "Sign up for free and join our community of donors and recipients.",
      icon: "user-plus",
    },
    {
      title: "Make a Donation",
      description: "Choose a cause or specific request that resonates with you and donate securely.",
      icon: "credit-card",
    },
    {
      title: "Track Your Impact",
      description: "Follow the progress of your donation and see the real-world impact you've made.",
      icon: "chart-line",
    },
  ]

  // Testimonials
  testimonials = [
    {
      quote:
        "ShareHope made it possible for my daughter to receive the treatment she desperately needed. We are forever grateful.",
      author: "Maria L.",
      role: "Parent of recipient",
      image: "https://intranet.youcode.ma//storage/users/profile/726-1696615682.jpg",
    },
    {
      quote:
        "As a doctor, I've seen firsthand how ShareHope connects resources to those who need them most. It's truly saving lives.",
      author: "Dr. James W.",
      role: "Medical professional",
      image: "https://intranet.youcode.ma/storage/users/profile/792-1696615701.jpg",
    },
    {
      quote:
        "The transparency and efficiency of this platform is remarkable. I know exactly where my donations are going.",
      author: "Robert K.",
      role: "Regular donor",
      image: "https://intranet.youcode.ma/storage/users/profile/958-1696615718.jpg",
    },
  ]

  // Partners
  partners = [
    { name: "Global Health Initiative", logo: "https://www.emro.who.int/templates/rwd/images/logo/who_emro_logo_en.png" },
    { name: "MedSupply International", logo: "https://medsupplyinc.com/images/medsupply-logo-min.png" },
    { name: "Care Without Borders", logo: "https://www.doctorswithoutborders.org/themes/custom/msf/logo.svg" },
    { name: "United Hospitals", logo: "https://cdn.prod.website-files.com/631f663e1b28505b2a6e8fa7/6331eeb3fb0fe73847903653_HU_2_COLOR-p-500.png" },
    { name: "Health Tech Innovations", logo: "https://hti.ai/wp-content/uploads/2020/09/HTI-Logo-main1.png" },
  ]

}
