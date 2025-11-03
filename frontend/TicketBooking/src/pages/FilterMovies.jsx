import { useState, useEffect } from "react";
import { Accordion, Button, Row, Col } from "react-bootstrap";
import "./FilterMovies.css"

const languages = ["en", "hi", "ja", "te", "ml", "mr", "ta"];
const languageLabels = {
  en: "English",
  hi: "Hindi",
  ja: "Japanese",
  te: "Telugu",
  ml: "Malayalam",
  mr: "Marathi",
  ta: "Tamil",
};

const genres = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 53, name: "Thriller" },
  { id: 10749, name: "Romance" },
  { id: 27, name: "Horror" },
  { id: 16, name: "Animation" },
];

const formats = ["2D", "3D", "IMAX", "4DX"];

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const FilterMovies = ({ onFilterChange, showReleaseMonth = false }) => {
  const [selectedLang, setSelectedLang] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);

  useEffect(() => {
    onFilterChange({
      languages: selectedLang,
      genres: selectedGenres,
      formats: selectedFormats,
      releaseMonths: showReleaseMonth ? selectedMonths : [], // ✅ only send if needed
    });
  }, [selectedLang, selectedGenres, selectedFormats, selectedMonths, showReleaseMonth, onFilterChange]);

  const toggleSelection = (item, state, setState) => {
    setState(
      state.includes(item) ? state.filter((i) => i !== item) : [...state, item]
    );
  };

  const renderButtons = (items, state, setState, isGenre = false, isMonth = false) => (
    <Row className="g-2">
      {items.map((item) => {
        const value = isGenre ? item.id : isMonth ? item.value : item;
        const label = isGenre ? item.name : isMonth ? item.label : languageLabels[item] || item;

        return (
          <Col xs="auto" key={value}>
            <Button
              variant={state.includes(value) ? "danger" : "outline-secondary"}
              size="sm"
              onClick={() => toggleSelection(value, state, setState)}
            >
              {label}
            </Button>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <div style={{ width: "300px", background: "#f6f7fb", padding: "16px", marginTop:"100px" }}>
      <h4 className="fw-bold mb-3">Filters</h4>

      <Accordion alwaysOpen flush>
        {/* Languages */}
        <Accordion.Item eventKey="0" className="mb-2 border rounded">
          <Accordion.Header>
            <span className="me-auto">Languages</span>
            <Button
              variant="link"
              size="sm"
              className="text-danger p-0"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLang([]);
              }}
            >
              Clear
            </Button>
          </Accordion.Header>
          <Accordion.Body>
            {renderButtons(languages, selectedLang, setSelectedLang)}
          </Accordion.Body>
        </Accordion.Item>

        {/* Genres */}
        <Accordion.Item eventKey="1" className="mb-2 border rounded">
          <Accordion.Header>
            <span className="me-auto">Genres</span>
            <Button
              variant="link"
              size="sm"
              className="text-danger p-0"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGenres([]);
              }}
            >
              Clear
            </Button>
          </Accordion.Header>
          <Accordion.Body>
            {renderButtons(genres, selectedGenres, setSelectedGenres, true)}
          </Accordion.Body>
        </Accordion.Item>

        {/* Formats */}
        <Accordion.Item eventKey="2" className="mb-2 border rounded">
          <Accordion.Header>
            <span className="me-auto">Format</span>
            <Button
              variant="link"
              size="sm"
              className="text-danger p-0"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFormats([]);
              }}
            >
              Clear
            </Button>
          </Accordion.Header>
          <Accordion.Body>
            {renderButtons(formats, selectedFormats, setSelectedFormats)}
          </Accordion.Body>
        </Accordion.Item>

        {/* ✅ Release Month (only if showReleaseMonth = true) */}
        {showReleaseMonth && (
          <Accordion.Item eventKey="3" className="mb-2 border rounded">
            <Accordion.Header>
              <span className="me-auto">Release Month</span>
              <Button
                variant="link"
                size="sm"
                className="text-danger p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMonths([]);
                }}
              >
                Clear
              </Button>
            </Accordion.Header>
            <Accordion.Body>
              {renderButtons(months, selectedMonths, setSelectedMonths, false, true)}
            </Accordion.Body>
          </Accordion.Item>
        )}
      </Accordion>

      {/* Browse by Cinemas */}
      <Button variant="outline-danger" className="w-100 mt-3 fw-medium">
        Browse by Cinemas
      </Button>
    </div>
  );
};

export default FilterMovies;
