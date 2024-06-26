import axios from 'axios';

type WikiDataResponse = {
  entities: {
    [key: string]: {
      pageid: number;
      ns: number;
      title: string;
      lastrevid: number;
      modified: string;
      type: string;
      id: string;
      claims: {
        [key: string]: [
          {
            mainsnak: {
              snaktype: string;
              property: string;
              hash: string;
              datavalue: {
                value: string;
                type: string;
              };
              datatype: 'external-id';
            };
            type: 'statement';
            id: string;
            rank: string;
          },
        ];
      };
    };
  };
};

export const getWikiData = async (
  wikiDataId?: string,
): Promise<string | null> => {
  if (!wikiDataId) {
    return null;
  }
  const response = await axios.get<WikiDataResponse>(
    `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikiDataId}&format=json&languages=en`,
  );
  return (
    response.data.entities[wikiDataId].claims['P9586'][0].mainsnak.datavalue
      .value || null
  );
};
