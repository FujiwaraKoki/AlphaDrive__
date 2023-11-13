//import React, { Component } from "react";
import React, { useState, useEffect } from 'react';
import moment from "moment";
import axios from 'axios';
import ShiftModal from './components/ShiftModal';
//import DatePicker from "react-datepicker";

// import Timeline, {DateHeader} from "react-calendar-timeline";
import Timeline from "react-calendar-timeline";

//import generateSampleData from "./generate-sample-data_from_db";
//import generateSampleData from "./generate-sample-data";

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title"
};

function App() {
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);

  const [ShiftType, setShiftType] = useState([]);
  const [EmployeeShift, setEmployeeShift] = useState([]);

  // const [isPopupOpen, setIsPopupOpen] = useState(false);  // ポップアップ表示可否
  const [isModalOpen, setIsModalOpen] = useState(false);  // モーダルウィンドウ表示可否

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const client = axios.create({
    // baseURL: "http://localhost:8000/"
    baseURL: "http://fujiwarakoki314.pythonanywhere.com/"
  });

  //client.defaults.xsrfCookieName = 'csrftoken';
  //client.defaults.xsrfHeaderName = "X-CSRFToken";
  // client.defaults.post['Content-Type'] = 'application/x-www-form-urlencoded';

  useEffect(() => {
    // const [groups, setGroups] = useState([]);
    // const [items, setItems] = useState([]);
    async function fetchData() {
      try {
        /*
        const db_data_custom_user = await axios.get('http://localhost:8000/users/CustomUser/');
        const db_data_shift_type = await axios.get('http://localhost:8000/manage/ShiftType/');
        const db_data_group_company = await axios.get('http://localhost:8000/manage/GroupCompany/');
        const db_data_employee_shift = await axios.get('http://localhost:8000/manage/EmployeeShift/');
        const db_data_max_office_hour = await axios.get('http://127.0.0.1:8000/manage/MaxOfficeHour/');
        */
        const db_data_custom_user = await client.get('/users/CustomUser/');
        const db_data_shift_type = await client.get('/manage/ShiftType/');
        const db_data_group_company = await client.get('/manage/GroupCompany/');
        const db_data_employee_shift = await client.get('/manage/EmployeeShift/');
        const db_data_max_office_hour = await client.get('/manage/MaxOfficeHour/');

        const custom_user = db_data_custom_user.data;
        const shift_type = db_data_shift_type.data;
        const group_company = db_data_group_company.data;
        const employee_shift = db_data_employee_shift.data;
        const max_office_hour = db_data_max_office_hour.data;

        console.log("custom_user: ", custom_user);
        console.log("shift_type: ", shift_type);
        console.log("group_company: ", group_company);
        console.log("employee_shift: ", employee_shift);
        console.log("max_office_hour: ", max_office_hour);

        setShiftType(shift_type);
        setEmployeeShift(employee_shift);

        var group = [];
        for (let i = 0; i < custom_user.length; i++) {
          group.push({
            id: i + 1,
            title: custom_user[i].user_name,
            rightTitle: custom_user[i].user_name,
            username: custom_user[i].username,
            user_name: custom_user[i].user_name,
            first_name: custom_user[i].first_name,
            last_name: custom_user[i].last_name,
            password: custom_user[i].password,  // 追加
            created_at: custom_user[i].created_at, // 追加
            is_staff: custom_user[i].is_staff, // 追加
            is_active: custom_user[i].is_active, // 追加
            is_superuser: custom_user[i].is_superuser, // 追加
            group_company_id: custom_user[i].group_company_id, // 追加
            bgColor: 'blue'
          })
        }
        setGroups(group);

        let item = [];
        for (let i = 0; i < employee_shift.length; i++) {
          let work_day = employee_shift[i].work_day;
          // let start_time = shift_type[employee_shift[i].shift_type - 1].start_time;
          // let end_time = shift_type[employee_shift[i].shift_type - 1].end_time;

          //const startDate = moment(work_day + ' ' + start_time);
          //const endDate = moment(work_day + ' ' + end_time);
          // const startDate = moment().year(work_day.year).month(work_day.month).day(work_day.day).hours(0).minutes(0).seconds(0);
          const startDate = moment(work_day).hours(0).minutes(0).seconds(0);
          //const endDate = moment().year(work_day.year).month(work_day.month).day(work_day.day+1).hours(0).minutes(0).seconds(0);
          //const endDate = startDate.add("days", 1);
          const endDate = moment(work_day).hours(23).minutes(59).seconds(59);
          console.log("startDate: ", startDate);
          console.log("endDate: ", endDate);
          item.push({
            id: i + 1,
            group: employee_shift[i].user,
            title: shift_type[employee_shift[i].shift_type - 1].name,
            shift_id: shift_type[employee_shift[i].shift_type - 1].id, // 追加
            work_day: work_day, //追加
            start: startDate,
            end: endDate,
            created_at: employee_shift[i].created_at,
            className: (moment(startDate).day() === 6 || moment(startDate).day() === 0) ? 'item-weekend' : '',
            canMove: true,
            // canResize: true,
            canResize: false
          })
        }

        /*
          "pk": 1,
          "fields": {
              "user": 1,
              "shift_type": 1,
              "work_day": "2023-10-15",
              "created_at": "2023-10-01T00:00:00.000000Z",
              "updated_at": "2023-10-01T00:00:00.000000Z"
          }
        */

        setItems(item);

        console.log("groups: ", groups);
        console.log("items: ", items);

      } catch (error) {
        console.error("Fetch error: ", error);
      }
    }

    fetchData();
    }, []
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedItemId !== null) {
        if (window.confirm('選択したアイテムを削除しますか？')) {
          setItems(items.filter(item => item.id !== selectedItemId));
          setSelectedItemId(null); // 選択をクリア
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItemId, items]);


  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const group = groups[newGroupOrder];
    const halfTime = 1000 * 60 * 60 * 12;
    const StartTime = moment(dragTime).startOf('day').valueOf();
    setItems(items.map(item =>
      item.id === itemId
        ? Object.assign({}, item, {
          // start: dragTime,
          // end: dragTime + (item.end - item.start),
          start: (dragTime - StartTime < halfTime) ? StartTime : StartTime + (item.end - item.start),
          end: (dragTime - StartTime < halfTime) ? StartTime + (item.end - item.start) : StartTime + (item.end - item.start) * 2,
          group: group.id
        })
        : item
    ));
    console.log(moment(dragTime).startOf('hour').valueOf());
    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  const handleItemResize = (itemId, time, edge) => {
    setItems(items.map(item =>
      item.id === itemId
        ? Object.assign({}, item, {
          start: edge === "left" ? time : item.start,
          end: edge === "left" ? item.end : time
        })
        : item
    ));
    console.log("Resized", itemId, time, edge);
  };

  const handleCanvasClick = (groupId, time, e) => {
    // ポップアップを表示する
    console.log("canvas clicked");
    setSelectedGroup(groupId);
    setSelectedDate(new Date(time));
    setIsModalOpen(true);
    console.log(groupId);
    console.log(time);
    console.log(selectedDate);
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== ''){
      const cookies = document.cookie.split(';');
      for (let i = 0; i< cookies.length; i++){
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + "=")){
          cookieValue = decodeURIComponent(cookie.substring(name.length+1));
          break;
        }
      }
    }
    return cookieValue
  }

  const handleSaveToDatabase = async () => {
    console.log("handleSaveToDatabase");
    try {
      var update_users = [];
      var update_shifts = [];

      for(let group of groups){
        var user_dict = {
          id: group.id,
          // username: group.username,
          user_name: group.user_name,
          first_name: group.first_name,
          last_name: group.last_name,
          // password: group.password,
          created_at: group.created_at,
          updated_at: "2023-11-09T00:00:00.000000Z",
          is_staff: group.is_staff,
          is_active: group.is_active,
          is_superuser: group.is_superuser,
          group_company_id: group.group_company_id
        };
        update_users.push(user_dict);
      }

      for(let item of items){
        var shift_dict = {
          id: item.id,
          user: item.group,
          shift_type: item.shift_id,
          // work_day: item.start,
          work_day: item.work_day,
          created_at: item.created_at,
          updated_at: "2023-11-09T00:00:00.000000Z",
        };
        update_shifts.push(shift_dict);
      }

      /*
        "pk": 1,
        "fields": {
            "user": 1,
            "shift_type": 1,
            "work_day": "2023-10-15",
            "created_at": "2023-10-01T00:00:00.000000Z",
            "updated_at": "2023-10-01T00:00:00.000000Z"
        }
      */

      // const payload = { groups, items };

      const headers = {
        // 'Content-Type': "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
        // "Access-Control-Allow-Origin": "*", 
        // 'X-CSRF-Token': await fetchCsrfToken()
        'X-CSRF-Token': getCookie('csrftoken')
      }
      var post_data_users = {
        users: update_users,
        delete_ids: []
      };
      var post_data_shift_manage = {
        shifts: update_shifts,
        delete_ids: []
      };

      console.log("headers: ", headers);
      console.log("post_data_users: ", post_data_users);
      console.log("post_data_shift_manage: ", post_data_shift_manage);

      // var url = await axios.post('http://localhost:8000/users/SaveButton', {"param": post_data_users}, {"headers": headers})
      // var url_users = await axios.post('http://localhost:8000/users/SaveButton/', post_data_users, {headers: headers})

      await client.post('/users/SaveButton/', post_data_users)
          .then(response => {
            console.log("response: ", response);
          })
          .catch(error => {
            console.log("error: ", error);
          });

      // var url = await axios.post('http://localhost:8000/manage/SaveButton', {"param": post_data_shift_manage}, { headers: headers })
      // var url_manage = await axios.post('http://localhost:8000/manage/SaveButton/', post_data_shift_manage, {headers: headers })
      await client.post('/manage/SaveButton/', post_data_shift_manage)
        .then(response => {
          console.log("response: ", response);
          if(response.status != 200){
            return response.json().then(data => {throw new Error(data.error)});
          }
        })
        .then(data => {
          alert("DBへの書き込みに成功しました!");
        })
        .then(error => {
          // alert('Error: ', error);
          console.log("error: ", error);
        })

    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await client.get('/users/csrf/');
      console.log("fetchCsrfToken response: ", response);
      return response.data.token;
    } catch(error){
      console.log("error: ", error);
    }
  }

  const handleAddGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  if (groups.length !== 0 && items.length !== 0) {
    return (
      <>
        <Timeline
          groups={groups}
          items={items}
          keys={keys}
          sidebarContent={<div>Above The Left</div>}
          itemsSorted
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={0.75}
          showCursorLine
          // defaultTimeStart={defaultTimeStart}
          // defaultTimeEnd={defaultTimeEnd}
          defaultTimeStart={moment().startOf('day')}
          defaultTimeEnd={moment().startOf('day').add(30, 'day')}
          onItemMove={handleItemMove}
          //onItemResize={handleItemResize}
          timeUnit="day"
          timeSteps={{ day: 1 }}
          onCanvasClick={handleCanvasClick}
          onItemSelect={itemId => setSelectedItemId(itemId)}
        />
        <button onClick={handleSaveToDatabase}>保存</button>
      </>
    );
  }
}

export default App;