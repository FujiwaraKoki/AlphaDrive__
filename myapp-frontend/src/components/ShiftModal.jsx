import { useEffect, useState } from 'react';
import moment from "moment";
//import Modal from 'react-modal';
//import {Button, Container} from "@mui/material";
//import Button from 'react-bootstrap/Button';
//import Modal from 'react-bootstrap/Modal';
import Modal from 'react-modal';
//import { DateTimePicker } from '@material-ui/pickers';
//import { DateTimePicker } from '@mui/x-date-pickers';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./ShiftModal.module.css";

const ShiftList = ["A", "B", "C"];



// const ShiftModal = ({selectedGroupId, totalShiftNum, shiftTypeList}) => {
function ShiftModal(props) {
  // const [shiftTypeList, setShiftTypeList] = useState(shiftTypeList)
  const [shiftName, setShiftName] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  var ShiftNameList = [];
  for (let tmpShitName of props.shiftTypeList) {
    ShiftNameList.push(tmpShitName);
  }

  useEffect(() => {
    async function openModal(date, shift) {
      setShiftName(shift);
      setSelectedDate(date);
      props.setIsModalOpen(true);
      console.log("modal open flg: ", props.isModalOpen);
    }

    openModal(props.selectedDate, 'A');
  }, []);

  /*
  const openModal = (date, shift) => {
    setShiftName(shift);
    setSelectedDate(date);
    setIsOpen(true);
  }
  */

  const closeModal = () => {
    props.setIsModalOpen(false);
  }

  const addItem = (item) => {
    // タイムラインにアイテムを追加するロジック
  };

  const parseAsMoment = (dateTimeStr) => {
    return moment.utc(dateTimeStr, 'YYYY-MM-DDTHH:mm:00Z', 'ja').utcOffset(9)
  };

  const toUtcIso8601str = (momentInstance) => {
    return momentInstance
        .clone()
        .utc()
        .format('YYYY-MM-DDTHH:mm:00Z')
  }

  const dateChange = (dateObj) => {
    setSelectedDate(toUtcIso8601str(moment(dateObj)))
  }

  const handleSubmit = () => {
    //const startDate = moment('2023-10-21 00:00:00');
    //const endDate = moment('2023-10-22 00:00:00');
    // const startDate = moment.format('YYYY-MM-DD 00:00:00').format();
    // const endDate = moment.format('YYYY-MM-DD 00:00:00').add(1, 'days').format();
    setStartDate(selectedDate);
    //setEndDate(selectedDate.add(1, 'days'));
    setEndDate(selectedDate);

    const newItem = {
      id: props.totalShiftNum + 1,
      group: props.selectedGroupId,
      title: shiftName,
      start: startDate,
      end: endDate,
      className: (moment(startDate).day() === 6 || moment(startDate).day() === 0) ? 'item-weekend' : '',
      canMove: true,
      canResize: true
      /*
      id: i + 1,
      group: employee_shift[i].user,
      title: shift_type[employee_shift[i].shift_type - 1].name,
      start: startDate,
      end: endDate,
      className: (moment(startDate).day() === 6 || moment(startDate).day() === 0) ? 'item-weekend' : '',
      canMove: true,
      canResize: true
      */
    };
    addItem(newItem);
    //onRequestClose();
    closeModal();
  };
  // <Modal isOpen={isOpen} onRequestClose={closeModal}>   {selectedGroupId, totalShiftNum, shiftTypeList}
  // <Modal selectedGroupId={selectedGroupId} totalShiftNum={totalShiftNum} shiftTypeList={shiftTypeList}>
  if (props.isModalOpen) {
    return (
        <div className="overlay">
          <div className="content">
            <form onSubmit={handleSubmit}>
              <label>
                シフト名:
                <select onChange={(e) => setShiftName(e.target.value)}>
                  {ShiftList.map((shift) => {
                    return <option key={shift}>{shift}</option>;
                  })}
                </select>
              </label>
              <br />
              <DatePicker
                label="日付"
                selected={selectedDate}
                onChange={dateChange}
                customInput={
                  <button>
                    {parseAsMoment(selectedDate).format('YYYY/MM/DD')}
                  </button>
                }
              />
              <br />
              <div style={{ display: "flex" }}>
                <button onClick={closeModal}>キャンセル</button>
                <div style={{ justifyContent: "space-between" }}>
                  <button type="submit">追加</button>
                </div>
              </div>
            </form>
          </div>
        </div>
    );
  } else {
    return null;
  }
};

export default ShiftModal;