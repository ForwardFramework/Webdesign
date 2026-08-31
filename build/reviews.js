/* ==========================================================================
   Google reviews for Top Gun Roofing LLC.
   Owner responses have been removed as requested.
   `truncated: true` marks reviews that Google displayed with a "… More"
   cut-off — only the text actually shown is reproduced, never invented.
   Reviews with `truncated: false` are complete and are the ones used for
   Review structured data.
   ========================================================================== */

const reviews = [
  {
    name: 'Lorraine Easton', rating: 5, when: 'a week ago', localGuide: true, truncated: false,
    text: 'Top Gun Roofing has been excellent in quality, customer service and professionalism! I highly recommend them and would give them 10 stars!',
  },
  {
    name: 'Lynn Bacco', rating: 5, when: '2 weeks ago', tag: 'Great price', truncated: true,
    text: 'I had a leak in my house after just having that and the roof replaced only 5 years ago. I had Cory the owner of Top Gun Roofing come out to give me a estimate on a repair and when he went on the roof he noticed that I had 2 forms of…',
  },
  {
    name: 'Helene Lardin', rating: 5, when: '3 weeks ago', tag: 'Great price', truncated: true,
    text: 'I highly recommend Top Gun Roofing company to anyone looking for quality workmanship and reliable service. From the initial estimate to the completed job, Cory was…',
  },
  {
    name: 'Amy Rankin', rating: 5, when: '3 weeks ago', truncated: true,
    text: 'We got quotes for new roofing from a handful of different companies, but Top Gun Roofing really stood out to us because Cory took the time to go over everything that needed done, some of which the other roofing companies didn’t even mention…',
  },
  {
    name: 'PseudoWyvern', rating: 5, when: 'a month ago', tag: 'Great price · $1–5,000', truncated: true,
    text: 'Cory and his team at Top Gun were incredible. The storms and winds this year wrecked havok on my roof and we were constantly leaking and paranoid that we wouldn’t be able to cover it even with insurance. Cory personally went to bat for us… They sent me numerous pictures of the damage before fixing everything, their commitment to making sure my roof would last decades was commendable. I wish I had before pictures, I have old house and this was falling apart at the seams. Top Gun’s team did all of this in a day.',
  },
  {
    name: 'Jacob Fitzpatrick', rating: 5, when: 'a month ago', localGuide: true, truncated: false,
    service: 'Residential roof inspection and maintenance · Soffit and fascia repair',
    text: 'Cory and his team were great to work with. We had a very small job but Cory still treated us with great respect and his team worked great to make a repair to our soffit and facia. Highly recommend Top Gun Roofing for any and all roofing needs.',
  },
  {
    name: 'Deborah Heal', rating: 5, when: 'a month ago', truncated: true,
    text: 'The owner of Top Gun Roofing is a young man that is the definition of INTEGRITY. He is professional, knowledgeable, meticulous and follows through with anything you ask of him. He was a pleasure to do business with and goes above and…',
  },
  {
    name: 'Melissa Kiss', rating: 5, when: 'a month ago', localGuide: true, tag: 'Great price', truncated: true,
    text: 'Anything roof-related is usually expensive, stressful, and not something anyone looks forward to. We needed an attic fan, and before Cory even talked about a quote, he took the time to make sure there weren’t any existing issues that needed…',
  },
  {
    name: 'Diane Dailey', rating: 5, when: 'a month ago', tag: 'Reasonable price · $15,000–20,000', truncated: true,
    text: 'Excellent work from beginning to end. The estimate I received was clear and accurate — no attempts to hard-sell unnecessary additional work. The workers were polite and made it easy for me to come and go as I needed. The workmanship is…',
  },
  {
    name: 'Jeffrey Wagner', rating: 5, when: 'a month ago', truncated: false,
    text: 'Owner is a 5 star character guy, honest as the day is long. A real pro, showed up when he said he would and did a fantastic job for my elderly mom at a great price. He is on my list of top roofing contractors. Can’t wait to work with him again at my own house.',
  },
  {
    name: 'Tyler Durden', rating: 5, when: 'a month ago', localGuide: true, truncated: true,
    text: 'Top Gun Roofing is top notch. Cory and his crew were amazing. He educated us to make sure we knew everything we were getting into every step of the way. This guy misses nothing — he is very thorough and meticulous from installation to…',
  },
  {
    name: 'Sandy Klocek', rating: 5, when: '2 months ago', truncated: false,
    text: 'I want to thank Top Gun Roofing for the outstanding work on replacing my roof and gutters. Cory is great to work with and insured that all work was completed to my satisfaction and his. He inspected all the finished work himself to insure this happened. I would highly recommend his company when you are looking for your roofing needs.',
  },
  {
    name: 'Sean McCallister', rating: 5, when: '2 months ago', truncated: true,
    text: 'I had an insurance claim for some wind damage on my roof. I wasnt familiar with the claims process or how it all worked. Cory with Top Gun Roofing walked me through each step. He explained how everything worked on his end and was open and…',
  },
  {
    name: 'Pearl the person', rating: 5, when: '3 months ago', truncated: false,
    text: 'This is my first time working with Cory with his business and he did an excellent job even down to the cleanup. He left the yard spotless — no nails or extra material at all. Very professional, came to work timely, explained everything in detail without any pressure. I would highly recommend him to anybody and everybody.',
  },
  {
    name: 'Carlos Mezarina', rating: 5, when: '3 months ago', truncated: false,
    text: 'When I found out my parents needed a new roof, I was stressing out every day. However, after sitting down with Cory and going over all the details all that stress went away. Everything was communicated, there were no surprises, and the roof came out amazing! So thankful for Top Gun Roofing!',
  },
  {
    name: 'Jacob Forschein', rating: 5, when: '3 months ago', truncated: false,
    text: 'Cory and Top Gun Roofing was fast and efficient at a good price. The entire experience from quote through install was easy and pleasant. The new roof looks great and the property was really clean afterwards. Thanks for the great job.',
  },
  {
    name: 'Linda Hillgrove', rating: 5, when: '3 months ago', truncated: false,
    text: 'They don’t make them any better than Cory and his crew. Hard working, does exactly what he says he will do, but above all else, Cory is an honest guy.',
  },
  {
    name: 'Suzi Gitto', rating: 5, when: '3 months ago', truncated: false,
    text: 'Did my roof replacement for a very reasonable price, with a quick turnaround. I highly recommend!',
  },
  {
    name: 'Blasé Nasiadka', rating: 5, when: '3 months ago', truncated: false,
    text: 'Very professional, showed up when they said and did a great job. Highly recommended.',
  },
  {
    name: 'Jordan Sullivan', rating: 5, when: '4 months ago', truncated: false,
    text: 'It was a pleasure working with Cory and his team. They were very professional and answered all questions. He was on time everyday and got the project completed without any issues. If you’re looking for a new roof I highly recommend Top Gun Roofing for all your roofing needs.',
  },
  {
    name: 'Matthew Mays', rating: 5, when: '4 months ago', truncated: true,
    text: 'Top Gun saved the day! We had another contractor providing service after ice dams wreaked havoc on our house. That contractor was doing a great job, but all of a sudden stopped showing up. Top Gun arrived on time, with great pricing and…',
  },
  {
    name: 'Chrissie Perry', rating: 5, when: '4 months ago', truncated: false,
    text: 'Cory was great! He was honest, thorough and was very professional. He really helped us out when we needed it! I will definitely remember him when it’s time for a replacement!',
  },
  {
    name: 'b fish', rating: 5, when: '4 months ago', truncated: false,
    text: 'Very honest and trustworthy company. Wouldn’t recommend anyone else — from start to finish they were awesome.',
  },
];

module.exports = { reviews };
