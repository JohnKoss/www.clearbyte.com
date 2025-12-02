export const NEW_SCORE_SHEET = `{
  "Services": [
    {
      "Id": "<service id e.g. 's3', 'ec2', etc.>",
      "Description": "<lab description>",
      "ScoreGroups": [
        {
          "ScoreType": "New",
          "GraderType": "10",
          "ScoredItems": [
            {
              "Score": 5,
              "Description": "<item activity description>",
              "Attributes": [
                {
                  "type": "create",
                  "path": [<path, can be '*' for all or '?' for any>],
                  "from": null,
                  "to": "<exact value or '*' for any>"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
`