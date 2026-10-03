import PropTypes from "prop-types";

const FrameComponent6 = ({ className = "" }) => {
  return (
    <div
      className={`flex-1 flex flex-col items-start justify-start pt-[4.187rem] px-[0rem] pb-[0rem] box-border min-w-[19.938rem] max-w-full shrink-0 text-left text-[1.563rem] text-[var(--text-primary)] font-M3-display-large mq450:pt-[2.75rem] mq450:box-border ${className}`}
    >
      <div className="self-stretch h-[24.438rem] relative font-extrabold inline-block z-[1] mq450:text-[1.25rem]">
        <p className="m-0">{`Facebook Profile Link: `}</p>
        <p className="m-0">&nbsp;</p>
        <p className="m-0">{`LinkedIn Profile Link : `}</p>
        <p className="m-0">&nbsp;</p>
        <p className="m-0">
          <span>{`Father’s Name : `}</span>
          <span className="text-primary">Kazi Sawkat</span>
        </p>
        <p className="m-0">&nbsp;</p>
        <p className="m-0">
          <span>{`Father’s Number : `}</span>
          <span className="text-primary">017685990321</span>
        </p>
        <p className="m-0">&nbsp;</p>
        <p className="m-0">
          <span>{`Mother’s Name : `}</span>
          <span className="text-primary">Tania Afrooz</span>
        </p>
        <p className="m-0">&nbsp;</p>
        <p className="m-0">
          <span>{`Mother’s Number : `}</span>
          <span className="text-primary">01956748392</span>
        </p>
        <p className="m-0">&nbsp;</p>
        <p className="m-0">
          <span>{`Emergency Contact : `}</span>
          <span className="text-primary">01778585432</span>
        </p>
      </div>
    </div>
  );
};

FrameComponent6.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent6;
