export interface AboutUsContent {
  id: string;
  pageTitle: string;
  pageSubtitle: string;
  description1: string;
  description2: string;
  cultureLabel: string;
  cultureTitle: string;
  servicesLabel: string;
  servicesTitle: string;
  teamLabel: string;
  teamTitle: string;
  teamDescription: string;
  televisionLabel?: string;
  televisionTitle?: string;
  televisionDescription?: string;
  youtubeLink1?: string;
  youtubeLink2?: string;
  youtubeLink3?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CultureItem {
  id: string;
  title_pt: string;
  description_pt: string;
  title?: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title_pt: string;
  description_pt: string;
  title?: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating/updating (backend expects PT fields)
export interface UpdateAboutUsContentDto {
  pageTitle_pt?: string;
  pageSubtitle_pt?: string;
  description1_pt?: string;
  description2_pt?: string;
  cultureLabel_pt?: string;
  cultureTitle_pt?: string;
  servicesLabel_pt?: string;
  servicesTitle_pt?: string;
  teamLabel_pt?: string;
  teamTitle_pt?: string;
  teamDescription_pt?: string;
  televisionLabel_pt?: string;
  televisionTitle_pt?: string;
  televisionDescription_pt?: string;
  youtubeLink1?: string;
  youtubeLink2?: string;
  youtubeLink3?: string;
}

export interface CreateCultureItemDto {
  title_pt: string;
  description_pt: string;
  order?: number;
}

export interface UpdateCultureItemDto {
  title_pt?: string;
  description_pt?: string;
  order?: number;
}

export interface CreateServiceItemDto {
  title_pt: string;
  description_pt: string;
  order?: number;
}

export interface UpdateServiceItemDto {
  title_pt?: string;
  description_pt?: string;
  order?: number;
}

// Depoimento interfaces
export interface Depoimento {
  id: string;
  clientName: string;
  text_pt: string;
  text_en?: string;
  text_fr?: string;
  createdAt: string;
  updatedAt: string;
}

// Response when fetching with locale (translated)
export interface DepoimentoLocalized {
  id: string;
  clientName: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepoimentoDto {
  clientName: string;
  text_pt: string;
}

export interface UpdateDepoimentoDto {
  clientName?: string;
  text_pt?: string;
}

// Podcast Content interfaces
export interface PodcastContentEpisode {
  id: string;
  url: string;
  title: string;
  videoId: string | null;
}

export interface PodcastContent {
  id: string;
  headerLabel: string;
  pageTitle: string;
  pageSubtitle: string;
  pageDescription: string;
  topicsLabel: string;
  topicsTitle: string;
  episodesLabel: string;
  episodesTitle: string;
  episodesDescription: string;
  episode1Title: string;
  episode2Title: string;
  episode3Title: string;
  episode4Title: string;
  episode5Title: string;
  episode6Title: string;
  episode1Url: string;
  episode2Url: string;
  episode3Url: string;
  episode4Url: string;
  episode5Url: string;
  episode6Url: string;
  hostLabel: string;
  hostName: string;
  hostDescription: string;
  // Host expanded fields
  hostCredential: string;
  hostParagraph1: string;
  hostParagraph2: string;
  hostParagraph3: string;
  hostQuote: string;
  hostLinkedInUrl: string;
  hostLinkedInLabel: string;
  // Director fields
  directorLabel: string;
  directorName: string;
  directorCredential: string;
  directorParagraph1: string;
  directorParagraph2: string;
  directorParagraph3: string;
  directorQuote: string;
  directorLinkedInUrl: string;
  directorLinkedInLabel: string;
  // About Section
  aboutLabel: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutOrigin: string;
  aboutIntention: string;
  aboutPresentation: string;
  // Guests Header
  guestsLabel: string;
  guestsTitle: string;
  // Gallery Header
  galleryLabel: string;
  galleryTitle: string;
  galleryDescription: string;
  // WhyListen Header
  whyListenLabel: string;
  whyListenTitle: string;
  whyListenSubtitle: string;
  // Testimonials Header
  testimonialsLabel: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  // CTA Final
  ctaLabel: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaHint: string;
  ctaButtonLabel: string;
  // Platforms Header
  platformsLabel: string;
  platformsTitle: string;
  platformsDescription: string;
  episodes: PodcastContentEpisode[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePodcastContentDto {
  headerLabel_pt?: string;
  pageTitle_pt?: string;
  pageSubtitle_pt?: string;
  pageDescription_pt?: string;
  topicsLabel_pt?: string;
  topicsTitle_pt?: string;
  episodesLabel_pt?: string;
  episodesTitle_pt?: string;
  episodesDescription_pt?: string;
  episode1Url?: string;
  episode1Title_pt?: string;
  episode2Url?: string;
  episode2Title_pt?: string;
  episode3Url?: string;
  episode3Title_pt?: string;
  episode4Url?: string;
  episode4Title_pt?: string;
  episode5Url?: string;
  episode5Title_pt?: string;
  episode6Url?: string;
  episode6Title_pt?: string;
  hostLabel_pt?: string;
  hostName?: string;
  hostDescription_pt?: string;
  // Host expanded fields
  hostCredential_pt?: string;
  hostParagraph1_pt?: string;
  hostParagraph2_pt?: string;
  hostParagraph3_pt?: string;
  hostQuote_pt?: string;
  hostLinkedInUrl?: string;
  hostLinkedInLabel_pt?: string;
  // Director fields
  directorLabel_pt?: string;
  directorName?: string;
  directorCredential_pt?: string;
  directorParagraph1_pt?: string;
  directorParagraph2_pt?: string;
  directorParagraph3_pt?: string;
  directorQuote_pt?: string;
  directorLinkedInUrl?: string;
  directorLinkedInLabel_pt?: string;
  // About Section
  aboutLabel_pt?: string;
  aboutTitle_pt?: string;
  aboutIntro_pt?: string;
  aboutOrigin_pt?: string;
  aboutIntention_pt?: string;
  aboutPresentation_pt?: string;
  // Guests Header
  guestsLabel_pt?: string;
  guestsTitle_pt?: string;
  // Gallery Header
  galleryLabel_pt?: string;
  galleryTitle_pt?: string;
  galleryDescription_pt?: string;
  // WhyListen Header
  whyListenLabel_pt?: string;
  whyListenTitle_pt?: string;
  whyListenSubtitle_pt?: string;
  // Testimonials Header
  testimonialsLabel_pt?: string;
  testimonialsTitle_pt?: string;
  testimonialsSubtitle_pt?: string;
  // CTA Final
  ctaLabel_pt?: string;
  ctaTitle_pt?: string;
  ctaDescription_pt?: string;
  ctaHint_pt?: string;
  ctaButtonLabel_pt?: string;
  // Platforms Header
  platformsLabel_pt?: string;
  platformsTitle_pt?: string;
  platformsDescription_pt?: string;
}

// Sell Property Content interfaces
export interface SellPropertyContent {
  id: string;
  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  // Form Section
  formTitle: string;
  formSubmit: string;
  // Stats Section
  statsBadge: string;
  statsTitle: string;
  statsDescription: string;
  statsReachLabel: string;
  statsReachDescription: string;
  statsClientsLabel: string;
  statsClientsDescription: string;
  statsLocationsLabel: string;
  statsLocationsDescription: string;
  statsExperienceLabel: string;
  statsExperienceDescription: string;
  // Marketing Section
  marketingBadge: string;
  marketingTitle: string;
  marketingDescription: string;
  marketingWebsiteTitle: string;
  marketingWebsiteDescription: string;
  marketingWebsiteStat: string;
  marketingNewsletterTitle: string;
  marketingNewsletterDescription: string;
  marketingNewsletterStat: string;
  marketingAgenciesTitle: string;
  marketingAgenciesDescription: string;
  marketingAgenciesStat: string;
  marketingMediaTitle: string;
  marketingMediaDescription: string;
  marketingMediaStat: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSellPropertyContentDto {
  // Hero Section
  heroBadge_pt?: string;
  heroTitle_pt?: string;
  heroDescription_pt?: string;
  // Form Section
  formTitle_pt?: string;
  formSubmit_pt?: string;
  // Stats Section
  statsBadge_pt?: string;
  statsTitle_pt?: string;
  statsDescription_pt?: string;
  statsReachLabel_pt?: string;
  statsReachDescription_pt?: string;
  statsClientsLabel_pt?: string;
  statsClientsDescription_pt?: string;
  statsLocationsLabel_pt?: string;
  statsLocationsDescription_pt?: string;
  statsExperienceLabel_pt?: string;
  statsExperienceDescription_pt?: string;
  // Marketing Section
  marketingBadge_pt?: string;
  marketingTitle_pt?: string;
  marketingDescription_pt?: string;
  marketingWebsiteTitle_pt?: string;
  marketingWebsiteDescription_pt?: string;
  marketingWebsiteStat_pt?: string;
  marketingNewsletterTitle_pt?: string;
  marketingNewsletterDescription_pt?: string;
  marketingNewsletterStat_pt?: string;
  marketingAgenciesTitle_pt?: string;
  marketingAgenciesDescription_pt?: string;
  marketingAgenciesStat_pt?: string;
  marketingMediaTitle_pt?: string;
  marketingMediaDescription_pt?: string;
  marketingMediaStat_pt?: string;
}
