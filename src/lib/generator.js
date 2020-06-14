import {normal} from "./random";

/**
 * Generate real-like rhythmic exercise data.
 * @returns {{histogram: number[], partitionTolerance: number[], isTolerated: boolean[], spanSize: number, sampleSize: number}}
 */
function generateRhythm({quantile, sampleSize = 60000, spanSize = 500} = {}) {
  // Normal distribution saved in array.
  // The array is divided into two parts, 0..sampleSize < 0 and n..2sampleSize > 0
  const randomStudentMissCounts = new Array(sampleSize).fill(0)
    .map(_ => parseInt(normal(-spanSize, spanSize, 1, 1)));
  const histogram = new Array(2 * spanSize).fill(0);
  randomStudentMissCounts.forEach(v => histogram[v + spanSize] += 1);
  // Flatten the middle "spike", due to artificial data.
  histogram.forEach((val, i) => {
    // Make it more unlikely, that some counted exactly mathematically perfect
    const dX = Math.pow(Math.abs(i - spanSize) * 2 / spanSize, 2.8);
    histogram[i] = val * dX * 11;
  });
  // Flatten center spike
  // groupedMissCounts[groupedMissCounts.length / 2] = (groupedMissCounts[groupedMissCounts.length / 2 - 1] + groupedMissCounts[groupedMissCounts.length / 2 + 1]) / 2;
  const partitionTolerance = [0, 0];
  // For quantile color lookup later
  const isTolerated = histogram.map((val, i) => {
    const dX = Math.abs(i - spanSize);
    const tolerated = dX < spanSize * quantile;
    partitionTolerance[tolerated ? 0 : 1] += val;
    return tolerated;
  });

  return {isTolerated, sampleSize, spanSize, histogram, partitionTolerance};
}

/**
 *
 * @param sampleSize
 * @param startAt
 * @returns {{startCount: *, startedCompletedPairs: [number, number][], courseCompletionRate: number, completionRate: number, completeCount: number}}
 */
function exerciseCompletion({sampleSize = 8, startAt = 1000} = {}) {
  const downRate = startAt / sampleSize * 0.7;

  const startedCompletedPairs = new Array(sampleSize)
    .fill(0)
    .map((_, i) => [
      Math.ceil(normal(startAt - i * downRate - downRate, startAt - i * downRate, 1.0)),
      Math.ceil(normal(startAt - (i + 1) * downRate - downRate, startAt - (i * 1.2) * downRate, 1.0)),
    ])
    .reverse();

  const completionRate = startedCompletedPairs.map(v => v[1])
    .reduce((a, b) => a + b) / startedCompletedPairs.map(v => v[0])
    .reduce((a, b) => a + b) * 100;

  const overallStart = startedCompletedPairs[startedCompletedPairs.length - 1][0] + startedCompletedPairs[startedCompletedPairs.length - 1][1];
  const overallEnd = startedCompletedPairs[0][1];
  const courseCompletionRate = (overallEnd / overallStart) * 100;

  return {startedCompletedPairs, completionRate, courseCompletionRate, startCount: overallStart, completeCount: overallEnd};
}

export {generateRhythm, exerciseCompletion};