interface Resources {
  "client-page": {
    "back-to-home": string;
    counter_one: string;
    counter_other: string;
    counter_zero: string;
    h1: string;
    title: string;
    "to-second-client-page": string;
  };
  footer: {
    description: string;
    languageSwitcher: string;
  };
  "second-client-page": {
    "back-to-home": string;
    h1: string;
    title: string;
  };
  "second-page": {
    "back-to-home": string;
    h1: string;
    title: string;
  };
  translation: {
    h1: string;
    title: string;
    "to-client-page": string;
    "to-second-page": string;
    welcome: string;
    blog: {
      text: string;
      link: string;
    };
    "get-started": string;
    by: string;
    docs: {
      title: string;
      description: string;
      link: string;
    };
    learn: {
      title: string;
      description: string;
      link: string;
    };
    templates: {
      title: string;
      description: string;
      link: string;
    };
    deploy: {
      title: string;
      description: string;
      link: string;
    };
  };
}

export default Resources;
