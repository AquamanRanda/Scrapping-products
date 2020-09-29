let tf = require("@tensorflow/tfjs");

let use = require("@tensorflow-models/universal-sentence-encoder");

let input_threshold = 0.8;
let score = [];
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

let get_embeddings = (list_sentences, callback) => {
  try {
    use.load().then((model) => {
      model.embed(list_sentences).then((embeddings) => {
        callback(embeddings);
      });
    });
  } catch (error) {
    console.log(error);
  }
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

let getScore = (cosineSimilarityMatrix) => {
  let dict_keys_in_group = {};
  let groups = [];
  let score;

  for (let i = 0; i < cosineSimilarityMatrix.length; i++) {
    let this_row = cosineSimilarityMatrix[i];
    for (let j = i; j < this_row.length; j++) {
      if (i != j) {
        let sim_score = cosineSimilarityMatrix[i][j];
        if (sim_score > input_threshold) {
          score = true;
        } else {
          score = false;
        }
        console.log(score);
      }
    }
  }
  return score;
};

let get_similarity = async (list_sentences) => {
  let callback = function (embeddings) {
    // console.log("embeddings", embeddings);

    let cosineSimilarityMatrix = cosine_similarity_matrix(
      embeddings.arraySync()
    );
    score = [];

    score.push(getScore(cosineSimilarityMatrix));
    console.log(score);
  };

  let embeddings = await get_embeddings(list_sentences, callback);
};

let sim_score = async (list_sentences) => {
  await get_similarity(list_sentences);
  return score;
};

module.exports = { sim_score };
