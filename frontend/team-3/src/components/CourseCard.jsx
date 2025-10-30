import { FaGraduationCap } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import catImg from "../../public/cato.jpg";
const CourseCard = (props) => (
  <a
    href={"/dashboard/course/" + props.id}
    className="block overflow-hidden transform transition-colors hover:bg-gray-300  rounded-lg py-4 px-2 w-full"
  >
    <div className="h-[70%] w-full bg-gray-200 overflow-hidden rounded-xl aspect-video">
      <img alt="catImg" src={catImg} className="  object-fill object-center" />
    </div>

    <div className="flex flex-col gap-1 p-4 h-auto flex-1">
      <h3
        className="font-medium text-gray-900 text-lg  line-clamp-2 text-start"
        title={props.name}
      >
        {props.name}
      </h3>

      {props.progress && (
        <div className="w-full bg-gray-200 rounded-full h-auto ">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${props.progress}%` }}
          />
        </div>
      )}
      {/* {props.description && (
        <p className="text-ellipsis">{props.description}</p>
      )} */}

      {/* Badges */}
      <div className="">
        <div className="flex flex-wrap gap-2 text-left text-xs lg:text-sm">
          <span className="inline-flex items-center gap-2  text-blue-700 ">
            <FaGraduationCap className="w-4 h-4" />
            {props.difficulty || "Digital Skills"}
          </span>
          <span className="inline-flex items-center gap-2  text-gray-700 ">
            <FaClock className="w-4 h-4" />
            {props.min_minutes} - {props.max_minutes} mins
          </span>
          {/* <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">
                        Type: {courseType}
                      </span> */}
        </div>
      </div>
    </div>
  </a>
);

export default CourseCard;
