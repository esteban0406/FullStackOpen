interface TotalProps {
  TotalExercises: number
}

const Total = (props: TotalProps) => {
  return (
    <div>
      <p>Number of exercises {props.TotalExercises}</p>
    </div>
  )
}

export default Total
