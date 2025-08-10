import LoadingGIF from "../assets/Loading.gif";

const Loading = () => {
    return (
        <>
            <img src={LoadingGIF} className="d-block m-auto" alt="" style={{ width: "200px" , borderRadius : "10px"}} />
        </>
    )
}
export default Loading;