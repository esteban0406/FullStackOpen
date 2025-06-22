interface CourseProps {
  name: string
}

const Header = (props: CourseProps) => {
  return <h1>{props.name}</h1>
}

export default Header
