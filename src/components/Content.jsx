import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Content = ({ className = "" }) => {
  const navigate = useNavigate();

  const onOptionShapeClick = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  const onHeaderShapeClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='dashboardText']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onRectangleClick = useCallback(() => {
    navigate("/job-card");
  }, [navigate]);

  return (
    <section
      className={`self-stretch flex flex-row items-start justify-start py-[0rem] pl-[4.562rem] pr-[4.625rem] box-border max-w-full text-left text-[1.5rem] font-roboto mq800:pl-[2.25rem] mq800:pr-[2.313rem] mq800:box-border ${className}`}
    >
      <div className="flex-1 flex flex-row items-start justify-between gap-[1.25rem] max-w-full mq800:flex-wrap">
        <div className="h-[18.125rem] w-[13.938rem] relative">
          <div
            className="absolute top-[0rem] left-[0rem] shadow-[0px_4px_20px_10px_rgba(0,_0,_0,_0.25)] rounded-3xs [background:linear-gradient(var(--primary),_var(--primary)),_var(--border)] border-[var(--text-primary)] border-solid border-[1px] box-border w-full h-full cursor-pointer z-[1]"
            onClick={onOptionShapeClick}
          />
          <b
            className="absolute top-[8.313rem] left-[4.125rem] inline-block text-transparent !bg-clip-text [background:linear-gradient(var(--text-primary),_var(--text-primary)),_var(--text-primary)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [text-shadow:1px_0_0_var(--text-secondary),_0_1px_0_var(--text-secondary),_-1px_0_0_var(--text-secondary),_0_-1px_0_var(--text-secondary)] min-w-[4.813rem] cursor-pointer z-[2] mq450:text-[1.188rem]"
            onClick={onOptionShapeClick}
          >
            Profile
          </b>
        </div>
        <div className="w-[13.938rem] flex flex-col items-start justify-start pt-[12.5rem] px-[0rem] pb-[0rem] box-border mq800:pt-[8.125rem] mq800:box-border">
          <div className="self-stretch h-[18.125rem] relative">
            <div
              className="absolute top-[0rem] left-[0rem] shadow-[0px_4px_20px_10px_rgba(0,_0,_0,_0.25)] rounded-3xs [background:linear-gradient(var(--text-secondary),_var(--text-secondary)),_linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_var(--border)] border-[var(--text-primary)] border-solid border-[1px] box-border w-full h-full cursor-pointer z-[1]"
              onClick={onHeaderShapeClick}
            />
            <b
              className="absolute top-[8.125rem] left-[3.125rem] inline-block text-transparent !bg-clip-text [background:linear-gradient(var(--text-primary),_var(--text-primary)),_var(--text-primary)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [text-shadow:1px_0_0_var(--text-secondary),_0_1px_0_var(--text-secondary),_-1px_0_0_var(--text-secondary),_0_-1px_0_var(--text-secondary)] min-w-[8.063rem] z-[2] mq450:text-[1.188rem]"
              data-scroll-to="dashboardText"
            >
              Dashboard
            </b>
          </div>
        </div>
        <div className="h-[18.125rem] w-[13.938rem] relative">
          <div
            className="absolute top-[0rem] left-[0rem] shadow-[0px_4px_20px_10px_rgba(0,_0,_0,_0.25)] rounded-3xs [background:linear-gradient(var(--text-muted),_var(--text-muted)),_linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_linear-gradient(rgba(174,_162,_162,_0.16),_rgba(174,_162,_162,_0.16)),_linear-gradient(rgba(174,_162,_162,_0.25),_rgba(174,_162,_162,_0.25)),_linear-gradient(rgba(0,_0,_0,_0.08),_rgba(0,_0,_0,_0.08)),_var(--border)] border-[var(--text-primary)] border-solid border-[1px] box-border w-full h-full cursor-pointer z-[1]"
            onClick={onRectangleClick}
          />
          <b
            className="absolute top-[7.625rem] left-[2.938rem] inline-block text-transparent !bg-clip-text [background:linear-gradient(var(--text-primary),_var(--text-primary)),_var(--text-primary)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] w-[8.688rem] [text-shadow:1px_0_0_var(--text-secondary),_0_1px_0_var(--text-secondary),_-1px_0_0_var(--text-secondary),_0_-1px_0_var(--text-secondary)] cursor-pointer z-[2] mq450:text-[1.188rem]"
            onClick={onRectangleClick}
          >
            Job Board
          </b>
        </div>
      </div>
    </section>
  );
};

Content.propTypes = {
  className: PropTypes.string,
};

export default Content;
