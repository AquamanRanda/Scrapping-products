// import * as tf from "@tensorflow/tfjs";
// import * as use from "@tensorflow-models/universal-sentence-encoder";

let tf = require("@tensorflow/tfjs-node-gpu");

let use = require("@tensorflow-models/universal-sentence-encoder");

let input_sentences = `Will it snow tomorrow?

The dog bit Johnny
Global warming is real
The mouse ate the cat
An apple a day, keeps the doctors away
Eating strawberries is healthy
The cat ate the mouse
How old are you?
Recently a lot of hurricanes have hit the US
How are you?
Johnny bit the dog
what is your age?
`;

let input_threshold = 0.5;

let dot = (a, b) => {
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var sum = 0;
  for (var key in a) {
    if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
      sum += a[key] * b[key];
    }
  }

  return sum;
};

let similarity = (a, b) => {
  var magnitudeA = Math.sqrt(dot(a, a));
  var magnitudeB = Math.sqrt(dot(b, b));
  if (magnitudeA && magnitudeB) return dot(a, b) / (magnitudeA * magnitudeB);
  else return false;
};

let cosine_similarity_matrix = (matrix) => {
  let cosine_similarity_matrix = [];
  for (let i = 0; i < matrix.length; i++) {
    let row = [];
    for (let j = 0; j < i; j++) {
      row.push(cosine_similarity_matrix[j][i]);
    }
    row.push(1);
    for (let j = i + 1; j < matrix.length; j++) {
      row.push(similarity(matrix[i], matrix[j]));
    }
    cosine_similarity_matrix.push(row);
  }
  return cosine_similarity_matrix;
};

let form_groups = (cosineSimilarityMatrix) => {
  let dict_keys_in_group = {};
  let groups = [];

  for (let i = 0; i < cosineSimilarityMatrix.length; i++) {
    let this_row = cosineSimilarityMatrix[i];
    for (let j = i; j < this_row.length; j++) {
      if (i != j) {
        let sim_score = cosineSimilarityMatrix[i][j];

        if (sim_score > input_threshold) {
          let group_num;

          if (!(i in dict_keys_in_group)) {
            group_num = groups.length;
            dict_keys_in_group[i] = group_num;
          } else {
            group_num = dict_keys_in_group[i];
          }
          if (!(j in dict_keys_in_group)) {
            dict_keys_in_group[j] = group_num;
          }

          if (groups.length <= group_num) {
            groups.push([]);
          }
          groups[group_num].push(i);
          groups[group_num].push(j);
        }
      }
    }
  }

  let return_groups = [];
  for (var i in groups) {
    return_groups.push(Array.from(new Set(groups[i])));
  }

  console.log(return_groups);
  return return_groups;
};

let get_similarity = async (list_sentences) => {
  let callback = function (embeddings) {
    // console.log("embeddings", embeddings);

    let cosineSimilarityMatrix = cosine_similarity_matrix(
      embeddings.arraySync()
    );

    let groups = form_groups(cosineSimilarityMatrix);

    let html_groups = "";
    for (let i in groups) {
      html_groups += "group  : " + String(parseInt(i) + 1);
      for (let j in groups[i]) {
        // console.log(groups[i][j], list_sentences[ groups[i][j] ])
        html_groups += list_sentences[groups[i][j]];
      }
    }

    let output_resultshtml = html_groups;
    console.log(output_resultshtml);
  };

  let embeddings = await get_embeddings(list_sentences, callback);
};

let get_embeddings = (list_sentences, callback) => {
  use.load().then((model) => {
    model.embed(list_sentences).then((embeddings) => {
      callback(embeddings);
    });
  });
};

let onClickAnalyzeSentences = () => {
  var list_sentences = [];

  var inputSentense = input_sentences.split("\n");
  for (var i in inputSentense) {
    if (inputSentense[i].length) {
      list_sentences.push(inputSentense[i]);
    }
  }

  console.log(inputSentense);
  get_similarity(inputSentense);
};

onClickAnalyzeSentences();
