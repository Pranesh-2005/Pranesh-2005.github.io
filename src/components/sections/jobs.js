import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import sr from '@utils/sr';
import { srConfig } from '@config';
import styled from 'styled-components';
import { theme, mixins, media, Section, Heading } from '@styles';
import { throttle } from '@utils';
import { IconCloud } from '../magiui/icon-cloud';

const { colors, fontSizes, fonts } = theme;

const slugs = [
  "anaconda", "apachehadoop", "azure", "gnubash", "c", "claude", "clion", "cockroachlabs", "css", "docker",
  "eclipseide", "fastapi", "flask", "git", "github", "gitlab", "gitlfs", "go", "googlecolab", "gradio",
  "graphql", "gunicorn", "html5", "huggingface", "intellij", "javascript", "jupyter", "json", "kaggle",
  "keras", "langchain", "linux", "matplotlib", "modelcontextprotocol", "mysql", "netlify", "npm", "numpy",
  "n8n", "ollama", "onnx", "openai", "opencv", "pandas", "pnpm", "postgresql", "pycharm", "pypi", "python",
  "pythonanywhere", "pytorch", "railway", "redis", "render", "scikitlearn", "selenium", "streamlit", "supabase",
  "tensorflow", "ubuntu", "uv", "vercel", "vscode", "virtualbox", "v0", "windows11", "yaml",
];

const deviconAvailable = new Set([
  "anaconda", "azure", "bash", "c", "clion", "css3", "docker", "eclipse", "fastapi", "flask",
  "git", "github", "gitlab", "go", "html5", "intellij", "javascript", "jupyter", "kaggle", "keras",
  "linux", "matplotlib", "mysql", "netlify", "npm", "numpy", "opencv", "pandas", "postgresql", "pycharm",
  "python", "pytorch", "redis", "scikitlearn", "selenium", "tensorflow", "ubuntu", "vercel", "vscode",
  "windows11", "yaml",
]);

// Simple Icons' CDN (cdn.simpleicons.org) doesn't serve this brand's mark; the
// npm package still does, but as an unfilled black path invisible on the dark
// canvas background, so it's inlined here with an explicit fill.
const inlineIcons = {
  openai:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2U2ZjFmZiI+PHBhdGggZD0iTTIyLjI4MTkgOS44MjExYTUuOTg0NyA1Ljk4NDcgMCAwIDAtLjUxNTctNC45MTA4IDYuMDQ2MiA2LjA0NjIgMCAwIDAtNi41MDk4LTIuOUE2LjA2NTEgNi4wNjUxIDAgMCAwIDQuOTgwNyA0LjE4MThhNS45ODQ3IDUuOTg0NyAwIDAgMC0zLjk5NzcgMi45IDYuMDQ2MiA2LjA0NjIgMCAwIDAgLjc0MjcgNy4wOTY2IDUuOTggNS45OCAwIDAgMCAuNTExIDQuOTEwNyA2LjA1MSA2LjA1MSAwIDAgMCA2LjUxNDYgMi45MDAxQTUuOTg0NyA1Ljk4NDcgMCAwIDAgMTMuMjU5OSAyNGE2LjA1NTcgNi4wNTU3IDAgMCAwIDUuNzcxOC00LjIwNTggNS45ODk0IDUuOTg5NCAwIDAgMCAzLjk5NzctMi45MDAxIDYuMDU1NyA2LjA1NTcgMCAwIDAtLjc0NzUtNy4wNzI5em0tOS4wMjIgMTIuNjA4MWE0LjQ3NTUgNC40NzU1IDAgMCAxLTIuODc2NC0xLjA0MDhsLjE0MTktLjA4MDQgNC43NzgzLTIuNzU4MmEuNzk0OC43OTQ4IDAgMCAwIC4zOTI3LS42ODEzdi02LjczNjlsMi4wMiAxLjE2ODZhLjA3MS4wNzEgMCAwIDEgLjAzOC4wNTJ2NS41ODI2YTQuNTA0IDQuNTA0IDAgMCAxLTQuNDk0NSA0LjQ5NDR6bS05LjY2MDctNC4xMjU0YTQuNDcwOCA0LjQ3MDggMCAwIDEtLjUzNDYtMy4wMTM3bC4xNDIuMDg1MiA0Ljc4MyAyLjc1ODJhLjc3MTIuNzcxMiAwIDAgMCAuNzgwNiAwbDUuODQyOC0zLjM2ODV2Mi4zMzI0YS4wODA0LjA4MDQgMCAwIDEtLjAzMzIuMDYxNUw5Ljc0IDE5Ljk1MDJhNC40OTkyIDQuNDk5MiAwIDAgMS02LjE0MDgtMS42NDY0ek0yLjM0MDggNy44OTU2YTQuNDg1IDQuNDg1IDAgMCAxIDIuMzY1NS0xLjk3MjhWMTEuNmEuNzY2NC43NjY0IDAgMCAwIC4zODc5LjY3NjVsNS44MTQ0IDMuMzU0My0yLjAyMDEgMS4xNjg1YS4wNzU3LjA3NTcgMCAwIDEtLjA3MSAwbC00LjgzMDMtMi43ODY1QTQuNTA0IDQuNTA0IDAgMCAxIDIuMzQwOCA3Ljg3MnptMTYuNTk2MyAzLjg1NThMMTMuMTAzOCA4LjM2NCAxNS4xMTkyIDcuMmEuMDc1Ny4wNzU3IDAgMCAxIC4wNzEgMGw0LjgzMDMgMi43OTEzYTQuNDk0NCA0LjQ5NDQgMCAwIDEtLjY3NjUgOC4xMDQydi01LjY3NzJhLjc5Ljc5IDAgMCAwLS40MDctLjY2N3ptMi4wMTA3LTMuMDIzMWwtLjE0Mi0uMDg1Mi00Ljc3MzUtMi43ODE4YS43NzU5Ljc3NTkgMCAwIDAtLjc4NTQgMEw5LjQwOSA5LjIyOTdWNi44OTc0YS4wNjYyLjA2NjIgMCAwIDEgLjAyODQtLjA2MTVsNC44MzAzLTIuNzg2NmE0LjQ5OTIgNC40OTkyIDAgMCAxIDYuNjgwMiA0LjY2ek04LjMwNjUgMTIuODYzbC0yLjAyLTEuMTYzOGEuMDgwNC4wODA0IDAgMCAxLS4wMzgtLjA1NjdWNi4wNzQyYTQuNDk5MiA0LjQ5OTIgMCAwIDEgNy4zNzU3LTMuNDUzN2wtLjE0Mi4wODA1TDguNzA0IDUuNDU5YS43OTQ4Ljc5NDggMCAwIDAtLjM5MjcuNjgxM3ptMS4wOTc2LTIuMzY1NGwyLjYwMi0xLjQ5OTggMi42MDY5IDEuNDk5OHYyLjk5OTRsLTIuNTk3NCAxLjQ5OTctMi42MDY3LTEuNDk5N1oiLz48L3N2Zz4=',
};

function getIconUrl(slug) {
  if (inlineIcons[slug]) {
    return inlineIcons[slug];
  }
  if (deviconAvailable.has(slug)) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
  }
  return `https://cdn.simpleicons.org/${slug}`;
}

const StyledContainer = styled(Section)`
  position: relative;
  max-width: 700px;
  ${media.tablet`max-width: 100%;`};
  ${media.thone`padding: 0 20px;`};
`;
const StyledTabs = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  ${media.thone`
    display: block;
  `};
`;
const StyledTabList = styled.ul`
  display: block;
  position: relative;
  width: max-content;
  z-index: 3;
  padding: 0;
  margin: 0;
  list-style: none;

  ${media.thone`
    display: flex;
    overflow-x: scroll;
    margin-bottom: 30px;
    width: calc(100% + 100px);
    margin-left: -50px;
  `};
  ${media.phablet`
    width: calc(100% + 50px);
    margin-left: -25px;
  `};

  li {
    &:first-of-type {
      ${media.thone`
        margin-left: 50px;
      `};
      ${media.phablet`
        margin-left: 25px;
      `};
    }
    &:last-of-type {
      ${media.thone`
        padding-right: 50px;
      `};
      ${media.phablet`
        padding-right: 25px;
      `};
    }
  }
`;
const StyledTabButton = styled.button`
  ${mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  background-color: transparent;
  height: ${theme.tabHeight}px;
  padding: 0 20px 2px;
  transition: ${theme.transition};
  border-left: 2px solid ${colors.lightestNavy};
  text-align: left;
  white-space: nowrap;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  color: ${props => (props.isActive ? colors.green : colors.slate)};
  ${media.tablet`padding: 0 15px 2px;`};
  ${media.thone`
    ${mixins.flexCenter};
    padding: 0 15px;
    text-align: center;
    border-left: 0;
    border-bottom: 2px solid ${colors.lightestNavy};
    min-width: 120px;
  `};
  &:hover,
  &:focus {
    background-color: ${colors.lightNavy};
  }
`;
const StyledHighlight = styled.span`
  display: block;
  background: ${colors.green};
  width: 2px;
  height: ${theme.tabHeight}px;
  border-radius: ${theme.borderRadius};
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;
  z-index: 10;
  transform: translateY(
    ${props => (props.activeTabId > 0 ? props.activeTabId * theme.tabHeight : 0)}px
  );
  ${media.thone`
    width: 100%;
    max-width: ${theme.tabWidth}px;
    height: 2px;
    top: auto;
    bottom: 0;
    transform: translateX(
      ${props => (props.activeTabId > 0 ? props.activeTabId * theme.tabWidth : 0)}px
    );
    margin-left: 50px;
  `};
  ${media.phablet`
    margin-left: 25px;
  `};
`;
const StyledTabContent = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding-top: 12px;
  padding-left: 0;
  ${media.tablet`padding-left: 0;`};
  ${media.thone`padding-left: 0;`};

  ul {
    ${mixins.fancyList};
  }
  a {
    ${mixins.inlineLink};
  }
`;
const StyledJobTitle = styled.h4`
  color: ${colors.lightestSlate};
  font-size: ${fontSizes.xxl};
  font-weight: 500;
  margin-bottom: 5px;
`;
const StyledIconCloudWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 720px;
  margin: 32px auto;
  background: ${colors.lightNavy};
  border-radius: ${theme.borderRadius};
`;

const MAX_CLOUD_SIZE = 700;
const MIN_CLOUD_SIZE = 180;

function sizeToPreset(size) {
  const iconSize = Math.round(size * (55 / MAX_CLOUD_SIZE));
  const radius = Math.round(size * (280 / MAX_CLOUD_SIZE));
  return [size, iconSize, radius];
}

function useCloudSize(wrapRef) {
  const [cloudSize, setCloudSize] = useState(() => sizeToPreset(MAX_CLOUD_SIZE));

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const measure = () => {
      const available = Math.floor(el.getBoundingClientRect().width);
      const size = Math.max(MIN_CLOUD_SIZE, Math.min(MAX_CLOUD_SIZE, available));
      setCloudSize(sizeToPreset(size));
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      const onResize = throttle(measure, 200);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const ro = new ResizeObserver(throttle(measure, 100));
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrapRef]);

  return cloudSize;
}

const Skills = ({ data }) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const cloudWrapRef = useRef(null);
  const [cloudSize, cloudIconSize, cloudRadius] = useCloudSize(cloudWrapRef);

  const revealContainer = useRef(null);
  useEffect(() => sr.reveal(revealContainer.current, srConfig()), []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
    } else {
      if (tabFocus >= tabs.current.length) setTabFocus(0);
      if (tabFocus < 0) setTabFocus(tabs.current.length - 1);
    }
  };

  useEffect(() => focusTab(), [tabFocus]);

  const onKeyPressed = e => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
      setTabFocus(tabFocus + (e.keyCode === 40 ? 1 : -1));
    }
  };

  return (
    <StyledContainer id="skills" ref={revealContainer}>
      <Heading>Languages and Tools I&apos;m Good At</Heading>
      <StyledTabs>
        <StyledTabList role="tablist" aria-label="Skill tabs" onKeyDown={onKeyPressed}>
          {data &&
            data.map(({ node }, i) => {
              const { title } = node.frontmatter;
              return (
                <li key={i}>
                  <StyledTabButton
                    isActive={activeTabId === i}
                    onClick={() => setActiveTabId(i)}
                    ref={el => (tabs.current[i] = el)}
                    id={`tab-${i}`}
                    role="tab"
                    aria-selected={activeTabId === i}
                    aria-controls={`panel-${i}`}
                    tabIndex={activeTabId === i ? '0' : '-1'}>
                    {/* <span>{title}</span> */}
                  </StyledTabButton>
                </li>
              );
            })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        {data &&
          data.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { title } = frontmatter;
            return (
              <StyledTabContent
                key={i}
                isActive={activeTabId === i}
                id={`panel-${i}`}
                role="tabpanel"
                aria-labelledby={`tab-${i}`}
                tabIndex={activeTabId === i ? '0' : '-1'}
                hidden={activeTabId !== i}>
                <StyledJobTitle>
                  {/* <span>{title}</span> */}
                </StyledJobTitle>
                <StyledIconCloudWrap ref={cloudWrapRef}>
                  <IconCloud
                    images={slugs.map(getIconUrl)}
                    size={cloudSize}
                    iconSize={cloudIconSize}
                    radius={cloudRadius}
                    maxSpeed={0.050}
                  />
                </StyledIconCloudWrap>
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </StyledTabContent>
            );
          })}
      </StyledTabs>
    </StyledContainer>
  );
};

Skills.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Skills;