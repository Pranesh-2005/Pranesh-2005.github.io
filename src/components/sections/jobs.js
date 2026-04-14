import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import sr from '@utils/sr';
import { srConfig } from '@config';
import styled from 'styled-components';
import { theme, mixins, media, Section, Heading } from '@styles';
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

function getIconUrl(slug) {
  if (deviconAvailable.has(slug)) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
  }
  return `https://cdn.simpleicons.org/${slug}/${slug}`;
}

const StyledContainer = styled(Section)`
  position: relative;
  max-width: 700px;
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

const Skills = ({ data }) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);

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
                <div style={{ margin: '32px auto', maxWidth: 620 }}>
                  <IconCloud
                    images={slugs.map(getIconUrl)}
                    size={700}
                    iconSize={55}
                    radius={280}
                    maxSpeed={0.050}
                  />
                </div>
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