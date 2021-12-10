import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { HStack, Tag, Text } from "@chakra-ui/react";

import * as Routes from "../../constants/Routes";
import SampleContext from "../../contexts/SampleContext";

import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";

type ButtonProps = { text: string; path: string };

const Button = ({ text, path }: ButtonProps) => {
  const history = useHistory();
  const navigateTo = () => history.push(path);
  return (
    <button className="btn btn-primary" onClick={navigateTo} type="button">
      {text}
    </button>
  );
};

const TeamInfoDisplay = () => {
  const { teamName, numTerms, members, isActive } = useContext(SampleContext);
  return (
    <div>
      <Text textStyle="display-large">Team Info</Text>
      <div>Name: {teamName}</div>
      <div># terms: {numTerms}</div>
      <div>
        Members:{" "}
        {members.map(
          (name, i) => ` ${name}${i === members.length - 1 ? "" : ","}`,
        )}
      </div>
      <div>Active: {isActive ? "Yes" : "No"}</div>
    </div>
  );
};

const DesignSystemDisplay = () => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <Text textStyle="display-large">Design System</Text>
      <div style={{ height: "1rem" }} />

      <HStack spacing={4} justify="center">
        {[
          {
            backgroundColor: "violet",
            textColor: "text.white",
            displayText: "Violet",
          },
          {
            backgroundColor: "teal",
            textColor: "text.white",
            displayText: "Teal",
          },
          {
            backgroundColor: "green.light",
            textColor: "text.default",
            displayText: "Light Green",
          },
          {
            backgroundColor: "green.dark",
            textColor: "text.white",
            displayText: "Dark Green",
          },
        ].map((style, index) => (
          <Tag
            bg={style.backgroundColor}
            color={style.textColor}
            size="lg"
            key={index}
          >
            {style.displayText}
          </Tag>
        ))}
      </HStack>

      <div style={{ height: "1rem" }} />
      {[
        {
          textStyle: "display-large",
          displayText: "Display Large",
        },
        {
          textStyle: "display-medium",
          displayText: "Display Medium",
        },
        {
          textStyle: "display-small-semibold",
          displayText: "Display Small - Semibold",
        },
        {
          textStyle: "display-small-regular",
          displayText: "Display Small - Regular",
        },
        {
          textStyle: "heading",
          displayText: "Heading",
        },
        {
          textStyle: "subheading",
          displayText: "Subheading",
        },
        {
          textStyle: "button-semibold",
          displayText: "Button - Semibold",
        },
        {
          textStyle: "button-regular",
          displayText: "Button - Regular",
        },
        {
          textStyle: "body-regular",
          displayText: "Body - Regular",
        },
        {
          textStyle: "body-bold",
          displayText: "Body - Bold",
        },
        {
          textStyle: "caption",
          displayText: "Caption",
        },
      ].map((style, index) => (
        <Text textStyle={style.textStyle} key={index}>
          {style.displayText}
        </Text>
      ))}
    </div>
  );
};

const Default = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <Text textStyle="display-large">Default Page</Text>
      <div className="btn-group" style={{ paddingRight: "10px" }}>
        <Logout />
        <RefreshCredentials />
        <Button text="Create Entity" path={Routes.CREATE_ENTITY_PAGE} />
        <Button text="Update Entity" path={Routes.UPDATE_ENTITY_PAGE} />
        <Button text="Display Entities" path={Routes.DISPLAY_ENTITY_PAGE} />
        <Button text="Edit Team" path={Routes.EDIT_TEAM_PAGE} />
        <Button text="Hooks Demo" path={Routes.HOOKS_PAGE} />
      </div>

      <div style={{ height: "2rem" }} />

      <TeamInfoDisplay />
      <DesignSystemDisplay />
    </div>
  );
};

export default Default;
