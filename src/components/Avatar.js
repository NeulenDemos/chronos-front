import {storageUrl} from "../context/utils";
import {ReactComponent as DefaultAvatar} from "../assets/images/account_circle_black_36dp.svg";

export const Avatar = ({avatar, size, username=null, padding=size / 2.8, rounded=true, units="px"}) => {
    let style = {};
    if (size)
        style = {...style, height: `${size}${units}`, width: `${size}${units}`};
    if (rounded)
        style = {...style, borderRadius: "999px"};
    if (avatar)
        return <img src={`${storageUrl}/images/${avatar}`} alt="Avatar" style={style}/>;
    if (username) {
        let lt = username[0];
        if (lt.codePointAt(0) >= 0xD800)
            lt += username[1];
        else
            lt = lt.toUpperCase();
        return (<div style={{...style, textAlign: "center", paddingTop: `${padding}${units}`, alignSelf: "center",
            backgroundColor: `hsl(${(lt.charCodeAt(0) - 65) * 360 / 26}deg, 50%, 48%)`}}>
            <span style={{fontWeight: 500, lineHeight: 0, fontSize: `${size * 2 / 3}${units}`, color: "#fff", userSelect: "none"}}>{lt}</span>
        </div>);
    }
    return <DefaultAvatar style={style}/>;
}
