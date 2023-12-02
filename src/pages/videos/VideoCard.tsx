interface VideoCardProps {
  video: Video,
}

const VideoCard: React.FC<VideoCardProps> = (props) => {
  const thumbnailPath = `thumbnail://${props.video.id}`
  console.log(thumbnailPath)
  return (
    <div 
      title={props.video.path}
      className='group/video-card flex flex-col items-start p-2 hover:bg-gray-200 hover:cursor-pointer w-64'
    >
      <img className="w-full h-40" src={thumbnailPath} />
      {/* <div className='w-full h-40 bg-gray-200 group-hover/video-card:bg-gray-100'></div> */}
      <p className='group-hover/video-card:font-semibold'>{props.video.path.split('\\').pop()?.split('/').pop()?.slice(0, -4)}</p>
      <p className='group-hover/video-card:underline text-gray-400 text-sm text-left w-full line-clamp-1'>{props.video.path}</p>
    </div>    
  )
}

export default VideoCard;