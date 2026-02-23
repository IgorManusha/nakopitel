import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Cashflow = () => {
  const [baseData, setBaseData] = useState([]);
  const [datasum, setDatasum] = useState(0);
  const [kurs, setKurs] = useState({ buy: 0, sale: 0 });
  const [convertedSum, setConvertedSum] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api");
        setBaseData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getData = () => {
    let datasum = 0;
    for (let key in baseData) {
      datasum += Number(baseData[key].summa);
    }
    setDatasum(datasum);
  };

  const delElem = (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    const deleteData = async () => {
      try {
        await axios.delete(`http://localhost:3000/api/del/${id}`);
        setBaseData(baseData.filter((item) => item.id !== parseInt(id)));
      } catch (error) {
        console.error("Error deleting data:", error);
      } finally {
        e.target.id.value = "";
      }
    };
    deleteData();
  };

  const createData = (e) => {
    e.preventDefault();
    const istochnik = e.target.istochnik.value;
    const summa = e.target.summa.value;
    const newData = { istochnik, summa };
    const postData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/data",
          newData,
        );
        setBaseData([...baseData, { id: response.data.id, ...newData }]);
      } catch (error) {
        console.error("Error creating data:", error);
      } finally {
        e.target.istochnik.value = "";
        e.target.summa.value = "";
      }
    };
    postData();
  };

  const getDataKurs = async () => {
    const response = await axios.get("http://localhost:3000/api/kursprivat");
    const uahBuy = response.data[1];
    const buy = uahBuy.buy;
    const sale = uahBuy.sale;
    setKurs({ buy, sale });
  };

  const fromUsd = () => {
    if (kurs.buy > 0) {
      const convertedSum = datasum / kurs.buy;
      setConvertedSum(convertedSum);
    }
  };

  return (
    <div className="cashflow">
      <div className="cashflow-item">
        <div className="del-container">
          <h3>Доход</h3>
          <button onClick={getData} className="button ">
            Oбщая сумма
          </button>
          {datasum > 0 ? <h3>Итого: {datasum}</h3> : ""}
        </div>

        <div>
          <button onClick={fromUsd} className="button ">
            uah from usd
          </button>
          {convertedSum > 0 && <h3>Итого в UAH: {convertedSum.toFixed(2)}</h3>}
        </div>

        <div className="del-container">
          <button onClick={getDataKurs} className="button ">
            Получить курсы валют
          </button>
          {kurs.buy > 0 && (
            <div className="kurs-info">
              <p>Курс покупки: {kurs.buy}</p>
              <p>Курс продажи: {kurs.sale}</p>
            </div>
          )}
        </div>

        <form onSubmit={createData} className="create-container">
          <h1>Создать новый элемент</h1>
          <input name="istochnik" placeholder="Источник" />
          <input name="summa" placeholder="Сумма" />
          <button type="submit">Create</button>
        </form>
        <form onSubmit={delElem} className="del-container">
          <h1>Удалить элемент</h1>
          <button type="submit">Удалить элемент</button>
          <input name="id" placeholder="id" />
        </form>
      </div>

      <div className="cashflow-item">
        <h3>Все доходы</h3>
        {baseData.map((item) => (
          <div key={item.id} className="datawatch">
            <p>{item.istochnik}</p>
            <p>{item.summa}</p>
            <p>id : {item.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cashflow;
