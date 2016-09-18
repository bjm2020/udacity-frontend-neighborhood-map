var neighborhood = {
  locations: [
    {
      location: {lat: 37.421956, lng: -122.084088},
      title: 'Google',
      placeId: 'ChIJj61dQgK6j4AR4GeTYWZsKWw',
      description: 'Google is a multinational corporation founded by Larry Page' +
        ' and Sergey Brin in 1998. Google specializes in Internet-related' +
        ' services and products, including search, cloud computing, online' +
        ' advertising technologies and software. Google established headquarters' +
        ' in Mountain View, California in 2006.',
      link: 'https://techcrunch.com/topic/company/google/'
    },
    {
      location: {lat: 37.331829, lng: -122.031180},
      title: 'Apple Inc.',
      placeId: 'ChIJt00z67a1j4ARL8h-xOZ1XVo',
      description: 'Founded in Cupertino, California in 1976 by Steve Jobs,' +
        ' Steve Wozniak and Ronald Wayne, Apple Inc. is an American multinational' +
        ' corporation that designs, develops and sells consumer electronics,' +
        ' computer software, online services and personal computers.',
      link: 'https://techcrunch.com/topic/company/apple/'
    },
    {
      location: {lat: 37.484360, lng: -122.148400},
      title: 'Facebook',
      placeId: 'ChIJZa6ezJa8j4AR1p1nTSaRtuQ',
      description: 'Facebook is an online social networking service founded by' +
        ' Mark Zuckerberg on February 4, 2004 with his college roommates and' +
        ' fellow Harvard University students Eduardo Saverin, Andrew McCollum,' +
        ' Dustin Moskovitz and Chris Hughes.',
      link: 'https://techcrunch.com/topic/company/facebook/'
    },
    {
      location: {lat: 37.786350, lng: -122.398229},
      title: 'Linkedin',
      placeId: 'ChIJGfpeqXyAhYARJd9N7lXKr0o',
      description: 'Founded in 2002 and launched in 2003, LinkedIn is a' +
        ' business-oriented social networking service created by Reid Hoffman,' +
        ' Allen Blue, Konstantin Guericke, Eric Ly and Jean-Luc Vaillant.' +
        ' LinkedIn is intended primarily for professional use and allows users' +
        ' to create profiles and connections in an online social network that' +
        ' can facilitate real-world professional relationships. As of June 2013,' +
        ' the service reported more than 259 million users in more than 200 countries.',
      link: 'https://techcrunch.com/topic/company/linkedin/'
    },
    {
      location: {lat: 37.775231, lng: -122.417517},
      title: 'Uber',
      placeId: 'ChIJE_P9I5yAhYARkssH6GvVJ2g',
      description: 'Founded in 2009 by Travis Kalanick and Garrett Camp,' +
        ' Uber is a venture-funded startup and transportation network company.' +
        ' Uber connects passengers with drivers of vehicles for hire and' +
        ' ridesharing services via a mobile app.',
      link: 'https://techcrunch.com/topic/company/linkedin/uber'
    },
    {
      location: {lat: 37.771757, lng: -122.405111},
      title: 'Airbnb',
      placeId: 'ChIJ3-Ibdix-j4ARDNwT7ivEwoc',
      description: 'Airbnb provides alternative lodging choices offered by' +
        ' private hosts, from air beds and shared spaces to a variety of' +
        ' properties, including homes, apartments, private rooms, castles,' +
        ' boats, manors, tree houses, tipis, igloos, private islands and other' +
        ' properties. Airbnb has more than 1,000,000 listings in 34,000 cities' +
        ' in 190 countries. Founded in 2008 by Brian Chesky, Joe Gebbia and' +
        ' Nate Blecharczyk, Airbnb is headquartered in San Francisco, California.',
      link: 'https://techcrunch.com/topic/company/airbnb/'
    },
    {
      location: {lat: 37.776792, lng: -122.416616},
      title: 'Twitter',
      placeId: 'ChIJWUSPbJyAhYARpQ8FtdnWDrE',
      description: 'Founded in 2006 by Jack Dorsey, Noah Glass, Biz Stone' +
        ' and Evan Williams, Twitter is an online social networking and' +
        ' microblogging service that enables users to send and read' +
        ' 140-character messages called tweets.',
      link: 'https://techcrunch.com/topic/company/twitter/'
    },
    {
      location: {lat: 37.781032, lng: -122.392692},
      title: 'Dropbox',
      placeId: 'ChIJf16Ze3iAhYARYwVEQT_LPVc',
      description: 'Founded in 2007 by Arash Ferdowsi and Drew Houston,' +
        ' Dropbox provides cloud-storage and file-sharing services that' +
        ' enable users to edit documents, add photos and share videos from' +
        ' anywhere. Dropbox also provides Dropbox for Business, a service' +
        ' that protects users’ work and lets teams store and access files' +
        ' from computers, phones or tablets.',
      link: 'https://techcrunch.com/topic/company/dropbox/'
    },
    {
      location: {lat: 37.770813, lng: -122.403896},
      title: 'Zynga',
      placeId: 'ChIJOYN7VjJ-j4ARZDCtWN5F6to',
      description: 'Created by Mark Pincus in 2007 (with founding team' +
        ' supporters Eric Schiermeyer, Michael Luxton, Justin Waldron,' +
        ' Kyle Stewart, Scott Dale, Andrew Trader and Steve Schoettler),' +
        ' Zynga provides social game services and develops social games for' +
        ' the Internet and for social networking sites, including Facebook,' +
        ' Google+, and Tencent. Zynga’s games also work on mobile phone' +
        ' platforms like Apple iOS and Android.',
      link: 'https://techcrunch.com/topic/company/zynga/'
    },
    {
      location: {lat: 37.429997, lng: -122.098119},
      title: 'Intuit',
      placeId: 'ChIJq5wKKha6j4ARR2e4lQPjjOg',
      description: 'Intuit offers business and financial management solutions' +
        ' for SMBs, financial institutions, consumers and accounting' +
        ' professionals. The company’s product portfolio includes TurboTax,' +
        ' a software solution that offers free tax filing, efile taxes,' +
        ' and income tax returns; Quicken; QuickBooks; Mint.com, and more.' +
        ' The company also offers end-to-end solutions for online tax' +
        ' preparation, download products, mobile tax prep, mortgage interest' +
        ' and property tax, corporations tax, military tax, and more.',
      link: 'https://www.crunchbase.com/organization/intuit#/entity',
    },
    {
      location: {lat: 37.492089, lng: -122.222341},
      title: 'Evernote',
      placeId: 'ChIJtbgliDC3j4ARzpUkRXkkm54',
      description: "Evernote builds apps and products that are defining" +
      " the way individuals and teams work today. As one workspace that" +
      " lives across people's phone, tablet and computer, Evernote is the" +
      " place people write free from distraction, collect information," +
      " find what they need and present their ideas to the world." +
      " Whatever peole are working toward, Evernote’s job is to make sure" +
      " they get there.",
      link: 'https://www.crunchbase.com/organization/evernote#/entity'
    },
    {
      location: {lat: 37.782276, lng: -122.391237},
      title: 'GitHub',
      placeId: 'ChIJ32KaYX-AhYARNa93OffiHEk',
      description: 'Launched in 2008 by Tom Preston-Werner, Chris Wanstrath' +
      ' and PJ Hyett, GitHub is a web-based hosting service for software' +
      ' development projects that use the Git revision control system.',
      link: 'https://techcrunch.com/topic/company/github/'
    }
  ]
};
