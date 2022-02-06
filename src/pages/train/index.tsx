import React, { useEffect, useState } from "react";
import Container from "../../shared/container";
import api from "../../util/api";
import Routes from "../../util/routes";
import "../../styles/train.css";
import { useParams } from "react-router-dom";
import Training from "./training";
import SetDone from "./setDone";
import ExerciseDone from "./exerciseDone";

export interface ExerciseData {
  title: string;
  description: string;
  sets: number;
  repeatsPerSet: number;
  videoPath: string | null;
  activated: boolean;
}

const Train = () => {
  const [exercise, setExercise] = React.useState<ExerciseData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [subPage /*, setSubPage*/] = useState<
    "training" | "setDone" | "exerciseDone"
  >("training");

  // exercisePlanId from the url
  const { exercisePlanId } = useParams();

  useEffect(() => {
    let isMounted = true;

    if (!loading) return;

    api.execute(Routes.getDoneExercises()).then((response) => {
      if (!isMounted) return;
      if (!response.success) {
        setError(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exerciseData = response.data.exercises.find((e: any) => {
        return e.exercise_plan_id === parseInt(exercisePlanId ?? "");
      });
      if (exerciseData)
        api
          .execute(Routes.getExercise({ id: exerciseData.id }))
          .then((response) => {
            setExercise({
              title: response.data.title,
              description: response.data.description,
              sets: exerciseData.sets,
              repeatsPerSet: exerciseData.repeats_per_set,
              videoPath:
                response.data.video ??
                "https://vid.pr0gramm.com/2021/12/28/130aaef3ab9c207a.mp4",
              activated: response.data.title,
            });
          });
      else setError(true);
      setLoading(false);
    });

    return () => {
      // clean up
      isMounted = false;
    };
  }, [loading, exercisePlanId]);

  return (
    <Container>
      {subPage === "training" && (
        <Training loading={loading} exercise={exercise} error={error} />
      )}
      {subPage === "setDone" && <SetDone stats={{}} />}
      {subPage === "exerciseDone" && <ExerciseDone stats={{}} />}
    </Container>
  );
};

export default Train;
